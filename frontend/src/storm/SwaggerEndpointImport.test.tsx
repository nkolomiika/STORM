import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SwaggerEndpointImport } from "./SwaggerEndpointImport";
import { useToastStore } from "../store";

describe("Swagger upload dialog", () => {
  beforeEach(() => useToastStore.setState({ toasts: [] }));
  it("opens a modal and parses dropped JSON using unknown for missing hosts", async () => {
    const parsed = vi.fn();
    render(<SwaggerEndpointImport onParsed={parsed} />);
    fireEvent.click(screen.getByRole("button", { name: "Upload Swagger JSON" }));
    const dialog = screen.getByRole("dialog", { name: "Upload Swagger JSON" });
    const file = new File([JSON.stringify({ openapi: "3.1.0", paths: { "/pets": { get: {} } } })], "api.json", { type: "application/json" });
    fireEvent.drop(within(dialog).getByRole("button", { name: "Drop Swagger JSON here" }), { dataTransfer: { files: [file] } });
    await waitFor(() => expect(parsed).toHaveBeenCalledWith(["GET https://unknown/pets"]));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  it("keeps the dialog open and reports malformed JSON as a toast", async () => {
    const parsed = vi.fn();
    render(<SwaggerEndpointImport onParsed={parsed} />);
    fireEvent.click(screen.getByRole("button", { name: "Upload Swagger JSON" }));
    fireEvent.change(screen.getByLabelText("Swagger JSON files"), { target: { files: [new File(["not json"], "broken.json")] } });
    await waitFor(() => expect(useToastStore.getState().toasts.some((toast) => toast.severity === "error" && toast.message.includes("Invalid JSON"))).toBe(true));
    expect(parsed).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
  it("closes on Escape without changing the endpoint draft", () => {
    const parsed = vi.fn();
    render(<SwaggerEndpointImport onParsed={parsed} />);
    fireEvent.click(screen.getByRole("button", { name: "Upload Swagger JSON" }));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(parsed).not.toHaveBeenCalled();
  });
});
