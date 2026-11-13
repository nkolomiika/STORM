import { beforeEach, describe, expect, it, vi } from "vitest";
import { getApiErrorMessage, getMe, login, logout, verifyTwoFactor } from "./api";
import { useAuthStore, useToastStore } from "./store";
import type { User } from "./types";

vi.mock("./api", () => ({
  getMe: vi.fn(), login: vi.fn(), logout: vi.fn(), verifyTwoFactor: vi.fn(),
  getApiErrorMessage: vi.fn(),
}));

const user: User = {
  id: 1, username: "tester", email: "tester@example.com", full_name: null, avatar_url: null,
  role: "admin", project_role: "lead", is_active: true, is_locked: false,
  totp_enabled: false, is_sso: false, password_changed_at: null, created_at: "2026-01-01T00:00:00Z",
};

describe("auth session initialization", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    window.history.replaceState({}, "", "/login");
    useAuthStore.setState({ user: null, isInitialized: false, isLoading: false, error: null });
  });

  it("restores an existing session when opening /login", async () => {
    vi.mocked(getMe).mockResolvedValue(user);
    await useAuthStore.getState().initialize();
    expect(getMe).toHaveBeenCalledOnce();
    expect(useAuthStore.getState()).toMatchObject({ user, isInitialized: true, isLoading: false });
  });

  it("keeps an initialized session on subsequent mounts", async () => {
    useAuthStore.setState({ user, isInitialized: true });
    await useAuthStore.getState().initialize();
    expect(getMe).not.toHaveBeenCalled();
    expect(useAuthStore.getState().user).toEqual(user);
  });

  it("finishes initialization when the server rejects the session", async () => {
    vi.mocked(getMe).mockRejectedValue(new Error("Unauthorized"));
    await useAuthStore.getState().initialize();
    expect(useAuthStore.getState()).toMatchObject({ user: null, isInitialized: true, isLoading: false });
  });

  it("does not start another initialization while one is pending", async () => {
    let resolve!: (value: User) => void;
    vi.mocked(getMe).mockReturnValue(new Promise((done) => { resolve = done; }));
    const pending = useAuthStore.getState().initialize();
    await useAuthStore.getState().initialize();
    expect(getMe).toHaveBeenCalledOnce();
    expect(useAuthStore.getState().isLoading).toBe(true);
    resolve(user);
    await pending;
    expect(useAuthStore.getState().user).toEqual(user);
  });

  it("loads the user only after a completed password login", async () => {
    vi.mocked(login).mockResolvedValue({ requires_2fa: false } as Awaited<ReturnType<typeof login>>);
    vi.mocked(getMe).mockResolvedValue(user);
    await expect(useAuthStore.getState().signIn("tester", "password")).resolves.toEqual({ status: "ok", user });
    expect(login).toHaveBeenCalledWith("tester", "password");
    expect(useAuthStore.getState()).toMatchObject({ user, isLoading: false, error: null });
  });

  it("does not establish a user session before the second factor", async () => {
    vi.mocked(login).mockResolvedValue({ requires_2fa: true } as Awaited<ReturnType<typeof login>>);
    await expect(useAuthStore.getState().signIn("tester", "password")).resolves.toEqual({ status: "2fa_required" });
    expect(getMe).not.toHaveBeenCalled();
    expect(useAuthStore.getState()).toMatchObject({ user: null, isLoading: false });
  });

  it.each(["signIn", "completeTwoFactor"] as const)("resets loading and reports a %s failure", async (action) => {
    vi.mocked(getApiErrorMessage).mockReturnValue("Access denied");
    const failure = new Error("Unauthorized");
    if (action === "signIn") vi.mocked(login).mockRejectedValue(failure);
    else vi.mocked(verifyTwoFactor).mockRejectedValue(failure);
    const pending = action === "signIn"
      ? useAuthStore.getState().signIn("tester", "wrong")
      : useAuthStore.getState().completeTwoFactor("000000");
    await expect(pending).rejects.toThrow("Access denied");
    expect(useAuthStore.getState()).toMatchObject({ user: null, isLoading: false, error: "Access denied" });
    expect(getMe).not.toHaveBeenCalled();
  });

  it("establishes the session after a valid second factor", async () => {
    vi.mocked(verifyTwoFactor).mockResolvedValue({} as Awaited<ReturnType<typeof verifyTwoFactor>>);
    vi.mocked(getMe).mockResolvedValue(user);
    await expect(useAuthStore.getState().completeTwoFactor("123456")).resolves.toEqual(user);
    expect(verifyTwoFactor).toHaveBeenCalledWith("123456");
    expect(useAuthStore.getState()).toMatchObject({ user, isLoading: false });
  });

  it("clears the session after logout", async () => {
    useAuthStore.getState().setUser(user);
    vi.mocked(logout).mockResolvedValue(undefined);
    await useAuthStore.getState().signOut();
    expect(logout).toHaveBeenCalledOnce();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it("refreshes the profile and clears a rejected session", async () => {
    vi.mocked(getMe).mockResolvedValueOnce(user).mockRejectedValueOnce(new Error("Expired"));
    await expect(useAuthStore.getState().refreshUser()).resolves.toEqual(user);
    expect(useAuthStore.getState().user).toEqual(user);
    await expect(useAuthStore.getState().refreshUser()).resolves.toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
  });
});

it("keeps toast identifiers unique when an earlier notification is dismissed", () => {
  useToastStore.setState({ nextId: 1, toasts: [] });
  useToastStore.getState().pushToast("First");
  useToastStore.getState().pushToast("Saved", "success");
  useToastStore.getState().dismissToast(1);
  useToastStore.getState().pushToast("Third", "info");
  expect(useToastStore.getState().toasts).toEqual([
    { id: 2, message: "Saved", severity: "success" },
    { id: 3, message: "Third", severity: "info" },
  ]);
});
