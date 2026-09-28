//! The loopback listener for Google's OAuth redirect.
//!
//! A browser page cannot bind a port, so this side owns the listener and the
//! webview asks for it. Two commands rather than one: `start` binds and reports
//! the port so the redirect URI is exact rather than a guess at a port that might
//! already be taken, and `await` blocks until Supabase redirects to it.
//!
//! 🔴 The `state` value is checked here, not in the webview. It rides inside the
//! redirect address (`src/lib/oauth-redirect.ts`), because Supabase keeps its own
//! state with Google and brings back only the query that address already had, plus
//! `code` or `error`. A request without this sign-in's state is one this app did not
//! begin: it is answered 404, it never reaches the code exchange, and the wait goes
//! on - so a stray request (the browser's favicon, a stale tab, another process on
//! this machine) cannot end a sign-in either.

use std::sync::Mutex;
use std::time::{Duration, Instant};

use tauri::State;
use tiny_http::{Header, Request, Response, Server};

#[derive(Default)]
pub struct OauthListener {
    inner: Mutex<Option<Pending>>,
}

struct Pending {
    server: Server,
    state: String,
}

/// The page the browser is left on once the reply carried a code. Deliberately
/// plain: it is shown outside the app, in a tab the person opened, and it should
/// say only that they can close it.
const DONE_PAGE: &str = "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\">\
<title>windowsweep</title></head><body style=\"font-family:system-ui;margin:3rem;line-height:1.6\">\
<h1 style=\"font-size:1.25rem\">Signed in.</h1>\
<p>You can close this tab and go back to windowsweep.</p></body></html>";

/// The same page without "Signed in.", for a reply that carried a refusal or
/// nothing at all. The window says what went wrong; the tab only lets go.
const CLOSE_PAGE: &str = "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\">\
<title>windowsweep</title></head><body style=\"font-family:system-ui;margin:3rem;line-height:1.6\">\
<p>You can close this tab and go back to windowsweep.</p></body></html>";

/// What one request on the loopback port turned out to be.
#[derive(Debug, PartialEq, Eq)]
enum Reply {
    /// This sign-in's state and a code: the redirect the window is waiting for.
    Code(String),
    /// This sign-in's state and an error: Google or Supabase refused, and said why.
    Refused(String),
    /// This sign-in's state and neither: the flow ended without a code.
    Empty,
    /// No state, or another one: not this sign-in's reply.
    NotOurs,
}

/// Classify a request target (`/?code=...&state=...`) against the state this
/// sign-in started with. An empty state never matches, so a reply cannot pass
/// the check by carrying `state=` against a sign-in that somehow had none.
fn classify(target: &str, expected_state: &str) -> Reply {
    let Ok(parsed) = url::Url::parse(&format!("http://127.0.0.1{target}")) else {
        return Reply::NotOurs;
    };

    let mut code: Option<String> = None;
    let mut state: Option<String> = None;
    let mut error: Option<String> = None;
    for (k, v) in parsed.query_pairs() {
        match k.as_ref() {
            "code" => code = Some(v.into_owned()),
            "state" => state = Some(v.into_owned()),
            "error" => error = Some(v.into_owned()),
            _ => {}
        }
    }

    // 🔴 The state check. A reply this app did not begin never reaches the exchange.
    if state.as_deref().filter(|s| !s.is_empty()) != Some(expected_state) {
        return Reply::NotOurs;
    }
    match (error, code) {
        (Some(e), _) => Reply::Refused(e),
        (None, Some(c)) => Reply::Code(c),
        (None, None) => Reply::Empty,
    }
}

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

/// Wait until this sign-in's redirect arrives, then hand back the authorization code.
///
/// The person can cancel by closing the browser tab and waiting for the timeout.
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
    let wait = Duration::from_secs(timeout_secs.clamp(10, 900));

    // It waits on a socket for minutes, so it goes to the blocking pool rather than
    // holding an async runtime thread - the reasoning `run_clean` records.
    tauri::async_runtime::spawn_blocking(move || wait_for_reply(&pending, wait))
        .await
        .map_err(|e| format!("the sign-in listener stopped: {e}"))?
}

/// Answer each request on the port until this sign-in's reply arrives or the time
/// runs out. Only that reply ends the wait.
fn wait_for_reply(pending: &Pending, wait: Duration) -> Result<String, String> {
    let deadline = Instant::now() + wait;
    loop {
        let left = deadline.saturating_duration_since(Instant::now());
        let request = pending
            .server
            .recv_timeout(left)
            .map_err(|e| format!("the sign-in reply could not be read: {e}"))?
            .ok_or_else(|| String::from("sign-in timed out - nothing was changed"))?;

        match classify(request.url(), &pending.state) {
            Reply::NotOurs => {
                let _ = request.respond(Response::empty(404));
            }
            Reply::Code(code) => {
                respond_page(request, DONE_PAGE);
                return Ok(code);
            }
            Reply::Refused(e) => {
                respond_page(request, CLOSE_PAGE);
                return Err(format!("sign-in was refused: {e}"));
            }
            Reply::Empty => {
                respond_page(request, CLOSE_PAGE);
                return Err(String::from("the sign-in reply carried no code"));
            }
        }
    }
}

/// Leave the browser tab on a page. The tab is a courtesy: if the header or the
/// write fails, the sign-in's outcome stands regardless.
fn respond_page(request: Request, page: &str) {
    let response = Response::from_string(page);
    let response = match Header::from_bytes(&b"Content-Type"[..], &b"text/html; charset=utf-8"[..])
    {
        Ok(header) => response.with_header(header),
        Err(()) => response,
    };
    let _ = request.respond(response);
}

#[cfg(test)]
mod tests {
    use super::*;

    const STATE: &str = "0b3f1c2e-4d5a-4b6c-8d7e-9f0a1b2c3d4e";

    /// 🔴 The one shape that must reach the exchange: this sign-in's state beside a
    /// code. Supabase re-encodes the query with its keys sorted, so the order is
    /// not part of the contract.
    #[test]
    fn this_state_with_a_code_is_the_code() {
        let code = Reply::Code("a1b2c3".into());
        assert_eq!(
            classify(&format!("/?code=a1b2c3&state={STATE}"), STATE),
            code
        );
        assert_eq!(
            classify(&format!("/?state={STATE}&code=a1b2c3"), STATE),
            code
        );
    }

    /// Everything else on the port is refused and never exchanged - including the
    /// exact reply 1.3.0 and 1.3.1 received, a code with no state at all.
    #[test]
    fn a_reply_without_this_state_is_not_ours() {
        assert_eq!(classify("/?code=a1b2c3", STATE), Reply::NotOurs);
        assert_eq!(
            classify("/?code=a1b2c3&state=another", STATE),
            Reply::NotOurs
        );
        assert_eq!(classify("/favicon.ico", STATE), Reply::NotOurs);
        assert_eq!(classify("/?code=a1b2c3&state=", ""), Reply::NotOurs);
    }

    /// A refusal names itself even when a code rides along, as the old listener did.
    #[test]
    fn this_state_with_an_error_is_refused() {
        let refused =
            format!("/?error=access_denied&error_description=The+user+denied&state={STATE}");
        assert_eq!(
            classify(&refused, STATE),
            Reply::Refused("access_denied".into())
        );
        let both = format!("/?code=a1b2c3&error=server_error&state={STATE}");
        assert_eq!(
            classify(&both, STATE),
            Reply::Refused("server_error".into())
        );
    }

    #[test]
    fn this_state_alone_is_a_reply_without_a_code() {
        assert_eq!(classify(&format!("/?state={STATE}"), STATE), Reply::Empty);
    }
}
