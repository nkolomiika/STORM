import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";

import { StormMarkdownEditor } from "./StormMarkdownEditor";

/* The point of this editor is that markdown renders in place while typing —
   "### " turns the line into a real <h3> in the same line, no preview pane. That
   comes from TipTap's StarterKit input rules, so these tests exercise the real
   editor rather than mocking it. */

const Harness = ({ initial = "" }: { initial?: string }) => {
  const [value, setValue] = useState(initial);
  return (
    <div className="storm">
      <StormMarkdownEditor value={value} onChange={setValue} placeholder="Write your note…" />
      <span data-testid="markdown">{value}</span>
    </div>
  );
};

/** Types into the ProseMirror surface the way input rules see it. */
const typeInto = async (el: HTMLElement, text: string) => {
  const { default: userEvent } = await import("@testing-library/user-event");
  const user = userEvent.setup();
  await user.click(el);
  await user.keyboard(text);
};

describe("StormMarkdownEditor", () => {
  it("renders existing markdown as formatted content, not as source text", async () => {
    render(<Harness initial={"# Заголовок\n\nабзац\n\n- пункт"} />);
    await waitFor(() => expect(document.querySelector(".stormmd-input h1")).toBeInTheDocument());
    expect(document.querySelector(".stormmd-input h1")).toHaveTextContent("Заголовок");
    expect(document.querySelector(".stormmd-input li")).toHaveTextContent("пункт");
    // The markup itself is never shown as literal text.
    expect(screen.queryByText("# Заголовок")).not.toBeInTheDocument();
  });

  it("turns '### ' into a heading in place as it is typed", async () => {
    render(<Harness />);
    const surface = document.querySelector(".stormmd-input") as HTMLElement;
    await typeInto(surface, "### Recon");

    await waitFor(() => expect(document.querySelector(".stormmd-input h3")).toBeInTheDocument());
    const h3 = document.querySelector(".stormmd-input h3") as HTMLElement;
    // The "### " is consumed by the input rule — the heading holds only the text.
    expect(h3).toHaveTextContent("Recon");
    expect(h3.textContent).not.toContain("#");
  });

  it("keeps the value as markdown so notes stay markdown in the database", async () => {
    render(<Harness />);
    const surface = document.querySelector(".stormmd-input") as HTMLElement;
    await typeInto(surface, "### Recon");

    await waitFor(() => expect(screen.getByTestId("markdown")).toHaveTextContent("### Recon"));
  });

  it("turns '- ' into a list item", async () => {
    render(<Harness />);
    const surface = document.querySelector(".stormmd-input") as HTMLElement;
    await typeInto(surface, "- первый");

    await waitFor(() => expect(document.querySelector(".stormmd-input ul li")).toBeInTheDocument());
    expect(screen.getByTestId("markdown")).toHaveTextContent("- первый");
  });

  it("selects an image, resizes from a corner, persists the width and hides handles outside", async () => {
    const initial = '![Screenshot](/api/v1/images/shot.png "Caption {width=320}")';
    const view = render(<Harness initial={initial} />);
    const image = await screen.findByAltText("Screenshot");
    const frame = image.parentElement as HTMLElement;
    expect(frame).toHaveStyle({ width: "320px" });
    expect(image).toHaveAttribute("title", "Caption");
    fireEvent(image, new MouseEvent("pointerdown", { bubbles: true, cancelable: true, clientX: 100, clientY: 100 }));
    const handles = Array.from(frame.querySelectorAll<HTMLButtonElement>(".stormmd-resize"));
    expect(handles).toHaveLength(4);
    expect(handles.every((handle) => !handle.hidden)).toBe(true);
    const handle = frame.querySelector(".stormmd-resize.se") as HTMLElement;
    fireEvent(handle, new MouseEvent("pointerdown", { bubbles: true, cancelable: true, clientX: 100, clientY: 100 }));
    fireEvent(document, new MouseEvent("pointermove", { bubbles: true, clientX: 180, clientY: 140 }));
    fireEvent(document, new MouseEvent("pointerup", { bubbles: true, clientX: 180, clientY: 140 }));
    await waitFor(() => expect(screen.getByTestId("markdown").textContent).toContain("Caption {width=400}"));
    expect(frame).toHaveStyle({ width: "400px" });
    fireEvent(document.body, new MouseEvent("pointerdown", { bubbles: true }));
    expect(handles.every((button) => button.hidden)).toBe(true);
    const saved = screen.getByTestId("markdown").textContent ?? "";
    view.unmount();
    render(<Harness initial={saved} />);
    expect((await screen.findByAltText("Screenshot")).parentElement).toHaveStyle({ width: "400px" });
  });

  it("cancels a resize without changing the stored Markdown", async () => {
    const initial = '![Screenshot](/api/v1/images/shot.png "{width=320}")';
    render(<Harness initial={initial} />);
    const image = await screen.findByAltText("Screenshot");
    fireEvent(image, new MouseEvent("pointerdown", { bubbles: true, cancelable: true }));
    const frame = image.parentElement as HTMLElement;
    fireEvent(frame.querySelector(".stormmd-resize.se") as HTMLElement, new MouseEvent("pointerdown", { bubbles: true, cancelable: true }));
    fireEvent(document, new MouseEvent("pointermove", { bubbles: true, clientX: 100, clientY: 50 }));
    fireEvent(document, new MouseEvent("pointercancel", { bubbles: true }));
    expect(frame).toHaveStyle({ width: "320px" });
    expect(screen.getByTestId("markdown").textContent).toBe(initial);
  });
});
