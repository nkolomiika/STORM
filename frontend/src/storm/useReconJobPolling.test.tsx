import { act, renderHook } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useReconJobPolling } from "./useReconJobPolling";

afterEach(() => vi.useRealTimers());

it("polls active jobs and does not poll completed jobs", async () => {
  vi.useFakeTimers();
  const options = { load: vi.fn().mockResolvedValue({ id: 1, status: "done" }), update: vi.fn(), retry: vi.fn(), error: vi.fn() };
  const { rerender } = renderHook(({ status }) => useReconJobPolling({ id: 1, status }, 2, options), { initialProps: { status: "done" } });
  await act(async () => { await vi.advanceTimersByTimeAsync(2000); });
  expect(options.load).not.toHaveBeenCalled();
  rerender({ status: "running" });
  await act(async () => { await vi.advanceTimersByTimeAsync(1500); });
  expect(options.load).toHaveBeenCalledWith(2, 1);
  expect(options.update).toHaveBeenCalledWith({ id: 1, status: "done" });
});

it("discards a late result after changing projects", async () => {
  vi.useFakeTimers();
  let finish!: (job: { id: number; status: string }) => void;
  const options = { load: vi.fn().mockReturnValue(new Promise((resolve) => { finish = resolve; })), update: vi.fn(), retry: vi.fn(), error: vi.fn() };
  const { rerender } = renderHook(({ projectId }) => useReconJobPolling({ id: 1, status: "running" }, projectId, options), { initialProps: { projectId: 2 } });
  await act(async () => { await vi.advanceTimersByTimeAsync(1500); });
  rerender({ projectId: 3 });
  await act(async () => { finish({ id: 1, status: "done" }); });
  expect(options.update).not.toHaveBeenCalled();
});

it("retries transient failures without repeated error toasts", async () => {
  vi.useFakeTimers();
  const options = { load: vi.fn().mockRejectedValue(new Error("connection lost")), update: vi.fn(), retry: vi.fn(), error: vi.fn() };
  const { rerender } = renderHook(({ tick }) => { void tick; useReconJobPolling({ id: 1, status: "running" }, 2, options); }, { initialProps: { tick: 0 } });
  await act(async () => { await vi.advanceTimersByTimeAsync(1500); });
  rerender({ tick: 1 });
  await act(async () => { await vi.advanceTimersByTimeAsync(1500); });
  expect(options.retry).toHaveBeenCalledTimes(2);
  expect(options.error).toHaveBeenCalledOnce();
});
