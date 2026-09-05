//! The loopback listener for Google's OAuth redirect.
//!
//! A browser page cannot bind a port, so this side owns the listener and the
//! webview asks for it. Two commands rather than one: `start` binds and reports
//! the port so the redirect URI is exact rather than a guess at a port that might
//! already be taken, and `await` blocks until Google redirects to it.
//!
//! 🔴 The `state` value is checked here, not in the webview. A redirect arriving
//! with a different state is a request this app did not begin, and it is refused
//! without ever reaching the code exchange.

use std::sync::Mutex;

use tauri::State;
use tiny_http::{Header, Response, Server};

#[derive(Default)]
pub struct OauthListener {
    inner: Mutex<Option<Pending>>,
}

struct Pending {
    server: Server,
    state: String,
}

/// The page the browser is left on. Deliberately plain: it is shown outside the
/// app, in a tab the person opened, and it should say only that they can close it.
const DONE_PAGE: &str = "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\">\
<title>windowsweep</title></head><body style=\"font-family:system-ui;margin:3rem;line-height:1.6\">\
<h1 style=\"font-size:1.25rem\">Signed in.</h1>\
<p>You can close this tab and go back to windowsweep.</p></body></html>";

#[tauri::command]
pub fn oauth_listen_start(
    listener: State<'_, OauthListener>,
    state: String,
) -> Result<u16, String> {
    let server = Server::http("127.0.0.1:0")
        .map_err(|e| format!("could not listen for the sign-in reply: {e}"))?;
    let port = server
        .server_addr()
        .to_ip()
        .ok_or_else(|| String::from("the loopback listener reported no port"))?
        .port();
    *listener
        .inner
        .lock()
        .map_err(|_| "the sign-in listener is in a bad state")? = Some(Pending { server, state });
    Ok(port)
}

/// Block until the redirect arrives, then hand back the authorization code.
///
/// Runs on Tauri's blocking pool because it waits on a socket; the window stays
/// responsive, and the person can cancel by closing the browser tab and waiting
/// for the timeout.
#[tauri::command]
pub async fn oauth_listen_await(
    listener: State<'_, OauthListener>,
    timeout_secs: u64,
) -> Result<String, String> {
    let pending = listener
        .inner
        .lock()
        .map_err(|_| "the sign-in listener is in a bad state")?
        .take()
        .ok_or_else(|| String::from("no sign-in was started"))?;

    let deadline = std::time::Duration::from_secs(timeout_secs.clamp(10, 900));
    let request = pending
        .server
        .recv_timeout(deadline)
        .map_err(|e| format!("the sign-in reply could not be read: {e}"))?
        .ok_or_else(|| String::from("sign-in timed out - nothing was changed"))?;

    let url = format!("http://127.0.0.1{}", request.url());
    let parsed =
        url::Url::parse(&url).map_err(|e| format!("the sign-in reply was malformed: {e}"))?;

    let mut code: Option<String> = None;
    let mut got_state: Option<String> = None;
    let mut error: Option<String> = None;
    for (k, v) in parsed.query_pairs() {
        match k.as_ref() {
            "code" => code = Some(v.into_owned()),
            "state" => got_state = Some(v.into_owned()),
            "error" => error = Some(v.into_owned()),
            _ => {}
        }
    }

    let header = Header::from_bytes(&b"Content-Type"[..], &b"text/html; charset=utf-8"[..])
        .map_err(|_| "could not build the reply page")?;
    let _ = request.respond(Response::from_string(DONE_PAGE).with_header(header));

    if let Some(e) = error {
        return Err(format!("sign-in was refused: {e}"));
    }
    // 🔴 The state check. A reply this app did not begin never reaches the exchange.
    if got_state.as_deref() != Some(pending.state.as_str()) {
        return Err("the sign-in reply did not match the request that started it".into());
    }
    code.ok_or_else(|| String::from("the sign-in reply carried no code"))
}
