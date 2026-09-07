//! Which disks the window may offer to clean.
//!
//! Fixed drives only. A cleanup tool that listed removable and network volumes
//! would be offering to delete from a USB stick or a colleague's share on the
//! strength of a drive letter, and neither is what "reclaim disk space on
//! Windows" means to the person reading it.
//!
//! 🔴 This asks Windows directly rather than shelling out. The engine could
//! answer it, but every engine call costs a PowerShell start-up, and this is read
//! at the top of a screen - so it goes through `kernel32` and returns in
//! microseconds. Nothing here writes, opens a handle, or takes a lock: the four
//! calls are the documented read-only volume queries.

use serde::Serialize;
use windows_sys::Win32::Storage::FileSystem::{
    GetDiskFreeSpaceExW, GetDriveTypeW, GetLogicalDrives, GetVolumeInformationW,
};

/// `DRIVE_FIXED` from `winbase.h`. Declared here because `windows-sys` 0.61.2
/// ships the four functions but not this constant - it has `FH_DRIVE_FIXED` and
/// `TAPE_DRIVE_FIXED`, which are different enumerations that happen to share the
/// prefix, and reaching for either would compile and then filter for the wrong
/// thing.
const DRIVE_FIXED: u32 = 3;

/// The longest volume label Windows stores, plus room for the terminator.
const LABEL_BUF: usize = 261;

/// One fixed drive, as the window shows it.
///
/// 🔴 Field names cross the IPC boundary verbatim - there is no `rename_all` here,
/// matching `RunFinished` in `engine.rs`, which is the app's other outbound
/// payload. Renaming a field is a breaking change to the web layer that the Rust
/// gates cannot see, which is what the serialisation test below exists to pin.
#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
pub struct DriveInfo {
    /// A single letter with no colon and no slash: `"C"`, not `"C:\\"`.
    pub letter: String,
    /// The volume label, or empty when the volume has none. Empty rather than
    /// `null` so the window has one thing to render instead of two.
    pub label: String,
    pub total_bytes: u64,
    pub free_bytes: u64,
}

/// A NUL-terminated wide string for the Win32 call.
fn wide(s: &str) -> Vec<u16> {
    s.encode_utf16().chain(std::iter::once(0)).collect()
}

/// Read back a wide buffer Windows filled, stopping at the terminator.
fn from_wide(buf: &[u16]) -> String {
    let end = buf.iter().position(|&c| c == 0).unwrap_or(buf.len());
    String::from_utf16_lossy(&buf[..end])
}

/// Every fixed, ready drive on this machine.
///
/// A drive that is present but not ready - BitLocker locked, or a fixed disk
/// mid-initialisation - fails the size query and is skipped rather than reported
/// with zeroes, because a drive showing 0 bytes free reads as full.
#[tauri::command]
pub fn list_drives() -> Vec<DriveInfo> {
    let mask = unsafe { GetLogicalDrives() };
    let mut out = Vec::new();

    for i in 0..26u32 {
        if mask & (1 << i) == 0 {
            continue;
        }
        let letter = (b'A' + i as u8) as char;
        let root = format!("{letter}:\\");
        let root_w = wide(&root);

        // SAFETY: `root_w` is a NUL-terminated wide string that outlives the call,
        // and `GetDriveTypeW` only reads it.
        if unsafe { GetDriveTypeW(root_w.as_ptr()) } != DRIVE_FIXED {
            continue;
        }

        let mut free_to_caller: u64 = 0;
        let mut total: u64 = 0;
        let mut total_free: u64 = 0;
        // SAFETY: three live, correctly-typed out-parameters, and a NUL-terminated
        // root path. The call writes only through the three pointers.
        let sized = unsafe {
            GetDiskFreeSpaceExW(
                root_w.as_ptr(),
                &mut free_to_caller,
                &mut total,
                &mut total_free,
            )
        };
        if sized == 0 {
            continue;
        }

        let mut label_buf = [0u16; LABEL_BUF];
        // SAFETY: the buffer and its length agree, and every optional
        // out-parameter this app does not want is passed as null, which the API
        // documents as permitted. The file-system name buffer is null with a
        // length of 0, the documented way to decline it.
        let named = unsafe {
            GetVolumeInformationW(
                root_w.as_ptr(),
                label_buf.as_mut_ptr(),
                label_buf.len() as u32,
                std::ptr::null_mut(),
                std::ptr::null_mut(),
                std::ptr::null_mut(),
                std::ptr::null_mut(),
                0,
            )
        };
        // A volume with no label is ordinary, and so is one whose information
        // cannot be read while its size can. Neither is a reason to hide the drive.
        let label = if named != 0 {
            from_wide(&label_buf)
        } else {
            String::new()
        };

        out.push(DriveInfo {
            letter: letter.to_string(),
            label,
            total_bytes: total,
            // What the person can actually reclaim, which is what Explorer shows
            // and what a quota-limited account really has. `total_free` ignores
            // quotas and would promise space the account cannot use.
            free_bytes: free_to_caller,
        });
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    /// 🔴 The wire shape, which is the only part of this a test can pin.
    ///
    /// A real enumeration is machine-dependent - this machine's drive letters,
    /// labels and free space are not another machine's, and asserting on them
    /// would be a test that fails on the CI runner for being correct. What is NOT
    /// machine-dependent is the four names the web layer destructures, and those
    /// are invisible to `cargo build`: rename one and Rust stays green while the
    /// window renders `undefined`.
    #[test]
    fn serialises_with_the_four_field_names_the_window_reads() {
        let one = DriveInfo {
            letter: "C".into(),
            label: "Windows".into(),
            total_bytes: 1_000_204_886_016,
            free_bytes: 250_000_000_000,
        };
        let json = serde_json::to_value(&one).expect("DriveInfo must serialise");
        let obj = json
            .as_object()
            .expect("an object, not an array or a string");

        for key in ["letter", "label", "total_bytes", "free_bytes"] {
            assert!(obj.contains_key(key), "the web layer reads `{key}`");
        }
        // Exactly four: an extra field is additive and harmless, but a RENAMED one
        // leaves the old key missing and a new key present, and only counting
        // catches the case where someone adds the new name without removing the
        // old reader.
        assert_eq!(obj.len(), 4, "unexpected fields: {:?}", obj.keys());

        // The values survive, and the big one is not truncated: a 1 TB disk is
        // past u32, and a u64 that serialised as a float would lose bytes.
        assert_eq!(obj["letter"], "C");
        assert_eq!(obj["label"], "Windows");
        assert_eq!(obj["total_bytes"], 1_000_204_886_016u64);
        assert_eq!(obj["free_bytes"], 250_000_000_000u64);
        assert!(obj["total_bytes"].is_u64(), "a float here would lose bytes");

        // A letter is a bare letter. The engine is handed `C:\` by the caller that
        // needs it; the window shows `C`. Fixing the convention here means the two
        // sides cannot disagree about whether the colon is included.
        assert_eq!(one.letter.len(), 1);
        assert!(!one.letter.contains(':') && !one.letter.contains('\\'));
    }

    /// The two wide-string helpers, which are where an off-by-one would corrupt a
    /// label rather than fail.
    #[test]
    fn round_trips_a_volume_label_through_the_wide_buffer() {
        // Windows fills a fixed buffer and leaves the tail as it found it; reading
        // the whole buffer instead of stopping at the terminator appends garbage.
        let mut buf = [0u16; LABEL_BUF];
        let src: Vec<u16> = "Data Drive".encode_utf16().collect();
        buf[..src.len()].copy_from_slice(&src);
        assert_eq!(from_wide(&buf), "Data Drive");

        // A label using the whole buffer with no terminator must not panic.
        let full = [b'X' as u16; LABEL_BUF];
        assert_eq!(from_wide(&full).len(), LABEL_BUF);

        // An empty label is an empty string, not a single NUL character.
        assert_eq!(from_wide(&[0u16; 8]), "");

        // And the outbound direction terminates, or the API reads past the end.
        let w = wide("C:\\");
        assert_eq!(w.last(), Some(&0u16));
        assert_eq!(w.len(), 4);
    }
}
