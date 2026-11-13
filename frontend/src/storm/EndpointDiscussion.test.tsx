import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "../api";
import { useToastStore } from "../store";
import type { EndpointComment } from "../types";
import { EndpointDiscussion } from "./EndpointDiscussion";

vi.mock("../api", async (importOriginal) => ({
  ...await importOriginal<typeof import("../api")>(),
  listEndpointComments: vi.fn(), createEndpointComment: vi.fn(),
}));
const record = (id: number, content: string, endpointId = 501): EndpointComment => ({
  id, content, endpoint_id: endpointId, user_id: 1, username: "tester", avatar_url: null,
  created_at: "2026-11-11T12:00:00Z", updated_at: "2026-11-11T12:00:00Z",
});
const page = (items: EndpointComment[], total = items.length, number = 1) => ({ items, total, page: number, size: 50, pages: Math.max(1, Math.ceil(total / 50)) });
const discussion = (id = 501) => <EndpointDiscussion key={id} projectId={2} hostId={11} endpointId={id} />;
beforeEach(() => {
  vi.mocked(api.listEndpointComments).mockReset().mockResolvedValue(page([]));
  vi.mocked(api.createEndpointComment).mockReset();
  useToastStore.setState({ toasts: [] });
});

describe("endpoint discussion", () => {
  it("posts once, stays open, clears the draft after success and reloads persisted comments", async () => {
    const saved: EndpointComment[] = [];
    vi.mocked(api.listEndpointComments).mockImplementation(async () => page([...saved]));
    vi.mocked(api.createEndpointComment).mockImplementation(async (_pid, _host, endpoint, content) => {
      const item = record(1, content, endpoint); saved.unshift(item); return item;
    });
    const view = render(discussion());
    await screen.findByText("No comments yet — start the discussion.");
    const input = screen.getByRole("textbox", { name: "Endpoint comment" });
    const button = screen.getByRole("button", { name: "Post comment" });
    expect(button).toBeDisabled();
    fireEvent.change(input, { target: { value: " \n\t" } });
    expect(button).toBeDisabled();
    fireEvent.change(input, { target: { value: "  Проверил эндпоинт  " } });
    fireEvent.click(button); fireEvent.click(button);
    expect(await screen.findByText("Проверил эндпоинт")).toBeInTheDocument();
    expect(api.createEndpointComment).toHaveBeenCalledExactlyOnceWith(2, 11, 501, "Проверил эндпоинт");
    expect(input).toHaveValue("");
    expect(screen.getByRole("button", { name: "Post comment" })).toBeDisabled();
    view.unmount();
    render(discussion());
    expect(await screen.findByText("Проверил эндпоинт")).toBeInTheDocument();
    expect(api.listEndpointComments).toHaveBeenCalledTimes(2);
  });

  it("keeps the draft on failure and permits a successful retry", async () => {
    vi.mocked(api.createEndpointComment).mockRejectedValueOnce(new Error("Request failed")).mockResolvedValueOnce(record(1, "Keep my draft"));
    render(discussion());
    await screen.findByText("No comments yet — start the discussion.");
    const input = screen.getByRole("textbox", { name: "Endpoint comment" });
    fireEvent.change(input, { target: { value: "Keep my draft" } });
    fireEvent.click(screen.getByRole("button", { name: "Post comment" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Post comment" })).not.toBeDisabled());
    expect(input).toHaveValue("Keep my draft");
    expect(useToastStore.getState().toasts.some((toast) => toast.severity === "error")).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Post comment" }));
    expect(await screen.findByText("Keep my draft")).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("does not mix a delayed response from another endpoint", async () => {
    let resolveFirst!: (value: ReturnType<typeof page>) => void;
    vi.mocked(api.listEndpointComments).mockImplementationOnce(() => new Promise((resolve) => { resolveFirst = resolve; }))
      .mockResolvedValueOnce(page([record(2, "Endpoint B", 502)]));
    const view = render(discussion());
    view.rerender(discussion(502));
    expect(await screen.findByText("Endpoint B")).toBeInTheDocument();
    await act(async () => { resolveFirst(page([record(1, "Endpoint A")])); });
    expect(screen.queryByText("Endpoint A")).not.toBeInTheDocument();
    expect(screen.getByText("Endpoint B")).toBeInTheDocument();
  });

  it("retries the failed page and deduplicates records shifted by a new comment", async () => {
    vi.mocked(api.listEndpointComments).mockResolvedValueOnce(page([record(3, "Third")], 3))
      .mockRejectedValueOnce(new Error("Page failed"))
      .mockResolvedValueOnce(page([record(3, "Third"), record(2, "Second")], 3, 2))
      .mockResolvedValueOnce(page([record(1, "First")], 3, 3));
    render(discussion());
    await screen.findByText("Third");
    fireEvent.click(screen.getByRole("button", { name: "Load more comments" }));
    fireEvent.click(await screen.findByRole("button", { name: "Retry loading comments" }));
    await screen.findByText("Second");
    expect(api.listEndpointComments).toHaveBeenLastCalledWith(2, 11, 501, 2);
    expect(screen.getAllByText("Third")).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Load more comments" }));
    await screen.findByText("First");
    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(screen.queryByRole("button", { name: "Load more comments" })).not.toBeInTheDocument();
  });
});
