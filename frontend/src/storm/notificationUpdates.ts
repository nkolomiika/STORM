/** Keep the bell current across live events, reconnects and missed deliveries. */
export function subscribeNotificationUpdates(refresh: () => Promise<void>, pollMs = 30_000): () => void {
  let stopped = false;
  let socket: WebSocket | null = null;
  let retry: ReturnType<typeof setTimeout> | undefined;
  let loading = false;
  let again = false;
  const reload = async () => {
    if (stopped) return;
    if (loading) { again = true; return; }
    loading = true;
    try { await refresh(); } catch { /* Keep the last successful list; retry later. */ }
    finally { loading = false; if (again && !stopped) { again = false; void reload(); } }
  };
  const connect = () => {
    if (stopped) return;
    try {
      socket = new WebSocket(`${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}/ws/notifications`);
      socket.addEventListener("open", () => { void reload(); });
      socket.addEventListener("message", (event) => {
        try {
          const data: unknown = JSON.parse(event.data);
          if (typeof data === "object" && data && ((data as { event?: string }).event === "notification" || (data as { entity?: string }).entity === "notification")) void reload();
        } catch { /* Ignore malformed/unrelated socket frames. */ }
      });
      socket.addEventListener("close", () => { if (!stopped) retry = setTimeout(connect, 3_000); });
      socket.addEventListener("error", () => { socket?.close(); });
    } catch { retry = setTimeout(connect, 3_000); }
  };
  const onFocus = () => { void reload(); };
  void reload();
  connect();
  const poll = setInterval(onFocus, pollMs);
  window.addEventListener("focus", onFocus);
  return () => { stopped = true; clearInterval(poll); clearTimeout(retry); window.removeEventListener("focus", onFocus); socket?.close(); };
}
