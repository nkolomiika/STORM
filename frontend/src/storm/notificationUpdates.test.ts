import { afterEach, expect, it, vi } from "vitest";
import { subscribeNotificationUpdates } from "./notificationUpdates";

class Socket extends EventTarget {
  static instances: Socket[] = [];
  close = vi.fn();
  constructor(public url: string) { super(); Socket.instances.push(this); }
}
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); Socket.instances = []; });

it("reloads on live notification events and reconnects, without external sockets", async () => {
  vi.useFakeTimers();
  vi.stubGlobal("WebSocket", Socket);
  const refresh = vi.fn(async () => {});
  const stop = subscribeNotificationUpdates(refresh);
  await Promise.resolve();
  expect(refresh).toHaveBeenCalledTimes(1);
  const socket = Socket.instances[0];
  expect(socket.url).toMatch(/\/ws\/notifications$/);
  socket.dispatchEvent(new MessageEvent("message", { data: '{"event":"notification"}' }));
  await Promise.resolve();
  expect(refresh).toHaveBeenCalledTimes(2);
  socket.dispatchEvent(new MessageEvent("message", { data: '{bad JSON' }));
  socket.dispatchEvent(new MessageEvent("message", { data: '{"event":"other"}' }));
  expect(refresh).toHaveBeenCalledTimes(2);
  socket.dispatchEvent(new Event("close"));
  await vi.advanceTimersByTimeAsync(3000);
  expect(Socket.instances).toHaveLength(2);
  Socket.instances[1].dispatchEvent(new Event("open"));
  await Promise.resolve();
  expect(refresh).toHaveBeenCalledTimes(3);
  stop();
  expect(Socket.instances[1].close).toHaveBeenCalled();
  await vi.advanceTimersByTimeAsync(60000);
  expect(refresh).toHaveBeenCalledTimes(3);
});

it("coalesces simultaneous events and retries missed updates through polling", async () => {
  vi.useFakeTimers();
  vi.stubGlobal("WebSocket", Socket);
  let finish!: () => void;
  const refresh = vi.fn().mockImplementationOnce(() => new Promise<void>((resolve) => { finish=resolve; })).mockResolvedValue(undefined);
  const stop = subscribeNotificationUpdates(refresh, 1000);
  for(let i=0;i<5;i++) Socket.instances[0].dispatchEvent(new MessageEvent("message", { data:'{"event":"notification"}' }));
  expect(refresh).toHaveBeenCalledTimes(1);
  finish();
  await Promise.resolve();
  await Promise.resolve();
  expect(refresh).toHaveBeenCalledTimes(2);
  await vi.advanceTimersByTimeAsync(1000);
  expect(refresh).toHaveBeenCalledTimes(3);
  stop();
});
