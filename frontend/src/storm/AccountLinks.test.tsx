import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "../api";
import { useAuthStore, useToastStore } from "../store";
import { StormActivate } from "./StormActivate";
import { StormReactivate } from "./StormReactivate";
import { StormResetPassword } from "./StormResetPassword";

vi.mock("../api", async (importOriginal) => ({
  ...await importOriginal<typeof import("../api")>(),
  getInvitationInfo: vi.fn(), checkInvitationUsername: vi.fn(), acceptInvitation: vi.fn(),
  getReactivationInfo: vi.fn(), completeReactivation: vi.fn(),
  getPasswordResetInfo: vi.fn(), confirmPasswordReset: vi.fn(),
}));

const pages = [
  { path: "/activate", Component: StormActivate, info: api.getInvitationInfo, heading: "Complete your registration" },
  { path: "/reactivate", Component: StormReactivate, info: api.getReactivationInfo, heading: "Welcome back" },
  { path: "/reset-password", Component: StormResetPassword, info: api.getPasswordResetInfo, heading: "Set a new password" },
] as const;

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  return <><span data-testid="location">{location.pathname}</span><button onClick={() => navigate(`${location.pathname}?token=second`)}>Switch token</button></>;
}

function open(page: typeof pages[number], token = "first") {
  return render(<MemoryRouter initialEntries={[page.path + (token ? `?token=${token}` : "")]}><page.Component /><Navigation /></MemoryRouter>);
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(api.getInvitationInfo).mockResolvedValue({ valid: true, email: "invited@example.test", full_name: null });
  vi.mocked(api.getReactivationInfo).mockResolvedValue({ valid: true, username: "invited" });
  vi.mocked(api.getPasswordResetInfo).mockResolvedValue({ valid: true, username: "invited" });
  vi.mocked(api.checkInvitationUsername).mockResolvedValue(true);
  useAuthStore.setState({ refreshUser: vi.fn().mockResolvedValue(null) });
  useToastStore.setState({ toasts: [], nextId: 1 });
});
afterEach(() => { vi.useRealTimers(); });

describe.each(pages)("public account link $path", (page) => {
  it("rejects a missing token without querying the backend", async () => {
    open(page, "");
    expect(await screen.findByRole("heading", { name: "Invalid link" })).toBeInTheDocument();
    expect(page.info).not.toHaveBeenCalled();
  });
  it.each(["expired", "used", "not_found"] as const)("shows a useful message for %s links", async (reason) => {
    vi.mocked(page.info).mockResolvedValue({ valid: false, reason });
    open(page);
    expect(await screen.findByRole("heading", { name: "Invalid link" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: page.heading })).not.toBeInTheDocument();
  });
  it("handles an unavailable link endpoint", async () => {
    vi.mocked(page.info).mockRejectedValue(new Error("Offline"));
    open(page);
    expect(await screen.findByRole("heading", { name: "Invalid link" })).toBeInTheDocument();
  });
  it("hides the previous valid form while checking a different token", async () => {
    open(page);
    await screen.findByRole("heading", { name: page.heading });
    vi.mocked(page.info).mockImplementation(() => new Promise(() => {}));
    fireEvent.click(screen.getByRole("button", { name: "Switch token" }));
    expect(screen.queryByRole("heading", { name: page.heading })).not.toBeInTheDocument();
    expect(screen.getByText("Checking the link…")).toBeInTheDocument();
  });
});

it("requires matching passwords and allows retry after a reset failure", async () => {
  open(pages[2]);
  await screen.findByRole("heading", { name: "Set a new password" });
  const save = screen.getByRole("button", { name: "Save password" });
  expect(save).toBeDisabled();
  fireEvent.change(screen.getByLabelText("New password"), { target: { value: "new-password" } });
  fireEvent.change(screen.getByLabelText("Confirm password"), { target: { value: "different" } });
  expect(save).toBeDisabled();
  fireEvent.change(screen.getByLabelText("Confirm password"), { target: { value: "new-password" } });
  vi.mocked(api.confirmPasswordReset).mockRejectedValueOnce(new Error("Try again"));
  fireEvent.click(save);
  await waitFor(() => expect(save).toBeEnabled());
  expect(screen.getByLabelText("New password")).toHaveValue("new-password");
  expect(useToastStore.getState().toasts.at(-1)?.message).toBe("Try again");
  vi.mocked(api.confirmPasswordReset).mockResolvedValueOnce(undefined);
  fireEvent.click(save);
  await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent("/login"));
  expect(api.confirmPasswordReset).toHaveBeenLastCalledWith("first", "new-password");
});

it("reactivates only on explicit click, and retries a failed request", async () => {
  open(pages[1]);
  const button = await screen.findByRole("button", { name: "Return to my account" });
  expect(api.completeReactivation).not.toHaveBeenCalled();
  vi.mocked(api.completeReactivation).mockRejectedValueOnce(new Error("Try again"));
  fireEvent.click(button);
  await waitFor(() => expect(button).toBeEnabled());
  expect(useAuthStore.getState().refreshUser).not.toHaveBeenCalled();
  vi.mocked(api.completeReactivation).mockResolvedValueOnce({ requires_2fa: false });
  fireEvent.click(button);
  await waitFor(() => expect(useAuthStore.getState().refreshUser).toHaveBeenCalledOnce());
  expect(api.completeReactivation).toHaveBeenLastCalledWith("first");
});

it("activates an invitation only after name availability and matching passwords", async () => {
  open(pages[0]);
  await screen.findByRole("heading", { name: "Complete your registration" });
  const button = screen.getByRole("button", { name: "Activate and sign in" });
  expect(button).toBeDisabled();
  fireEvent.change(screen.getByLabelText("Full name"), { target: { value: "New User" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "new-password" } });
  fireEvent.change(screen.getByLabelText("Confirm password"), { target: { value: "new-password" } });
  await waitFor(() => expect(button).toBeEnabled());
  vi.mocked(api.acceptInvitation).mockRejectedValueOnce(new Error("Name was taken"));
  fireEvent.click(button);
  await waitFor(() => expect(button).toBeEnabled());
  expect(useAuthStore.getState().refreshUser).not.toHaveBeenCalled();
  vi.mocked(api.acceptInvitation).mockResolvedValueOnce({ requires_2fa: false });
  fireEvent.click(button);
  await waitFor(() => expect(useAuthStore.getState().refreshUser).toHaveBeenCalledOnce());
  expect(api.acceptInvitation).toHaveBeenLastCalledWith("first", { username: "New User", password: "new-password" });
});

it("ignores late availability responses for a previously entered name", async () => {
  open(pages[0]);
  await screen.findByRole("heading", { name: "Complete your registration" });
  let resolveOld!: (value: boolean) => void;
  vi.mocked(api.checkInvitationUsername).mockImplementationOnce(() => new Promise((resolve) => { resolveOld = resolve; }));
  fireEvent.change(screen.getByLabelText("Full name"), { target: { value: "Old Name" } });
  await waitFor(() => expect(api.checkInvitationUsername).toHaveBeenCalledWith("first", "Old Name"));
  vi.mocked(api.checkInvitationUsername).mockImplementationOnce(() => new Promise(() => {}));
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "new-password" } });
  fireEvent.change(screen.getByLabelText("Confirm password"), { target: { value: "new-password" } });
  fireEvent.change(screen.getByLabelText("Full name"), { target: { value: "New Name" } });
  await waitFor(() => expect(api.checkInvitationUsername).toHaveBeenCalledWith("first", "New Name"));
  await act(async () => { resolveOld(true); });
  expect(screen.queryByText("Name available")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Activate and sign in" })).toBeDisabled();
});
