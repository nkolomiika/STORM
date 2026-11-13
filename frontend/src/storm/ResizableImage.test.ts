import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent } from "@testing-library/react";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { TextSelection } from "@tiptap/pm/state";
import { ResizableImage } from "./ResizableImage";

const instances: Editor[] = [];
const create = (content: string) => {
  const element = document.createElement("div");
  document.body.append(element);
  const editor = new Editor({ element, extensions: [StarterKit, ResizableImage.configure({ inline: true }), Markdown.configure({ html: false })], content });
  instances.push(editor);
  return editor;
};
afterEach(() => { instances.splice(0).forEach((editor) => { const element = editor.options.element; editor.destroy(); if (element instanceof HTMLElement) element.remove(); }); vi.restoreAllMocks(); });

describe("inline image cursor and drag/drop", () => {
  it("puts a text cursor to the right of the last image and allows typing there", () => {
    const editor = create('![Screenshot](/image.png "{width=320}")');
    const image = editor.view.dom.querySelector("img")!;
    // ProseMirror may recreate the node view when selection decorations change.
    // Model image geometry across that lifecycle, as a browser layout would.
    vi.spyOn(HTMLImageElement.prototype, "getBoundingClientRect").mockReturnValue({ x: 0, y: 0, left: 0, top: 0, right: 320, bottom: 240, width: 320, height: 240, toJSON: () => ({}) });
    fireEvent(image, new MouseEvent("pointerdown", { bubbles: true }));
    const paragraph = editor.view.dom.querySelector("p")!;
    fireEvent(paragraph, new MouseEvent("pointerdown", { bubbles: true, clientX: 400, clientY: 100 }));
    expect(editor.state.selection).toBeInstanceOf(TextSelection);
    expect(editor.state.selection.from).toBe(2);
    expect(editor.view.dom).toHaveClass("stormmd-image-caret-active");
    expect(editor.view.dom.querySelectorAll(".stormmd-image-caret")).toHaveLength(1);
    expect((editor.storage as unknown as { markdown: { getMarkdown: () => string } }).markdown.getMarkdown()).toBe('![Screenshot](/image.png "{width=320}")');
    editor.commands.insertContent("after the image");
    const content = editor.state.doc.firstChild!;
    expect(content.child(0).type.name).toBe("image");
    expect(content.child(1).text).toBe("after the image");
    expect(editor.view.dom.querySelectorAll(".stormmd-image-caret")).toHaveLength(0);
    expect(editor.view.dom).not.toHaveClass("stormmd-image-caret-active");
    expect(Array.from(editor.view.dom.querySelectorAll<HTMLButtonElement>(".stormmd-resize")).every((handle) => handle.hidden)).toBe(true);
  });

  it("hides the image caret for node selection and text ranges, then restores it beside the image", () => {
    const editor = create('Before ![Screenshot](/image.png "{width=320}") after');
    let pos = 0;
    editor.state.doc.descendants((node, offset) => { if (node.type.name === "image") pos = offset; });
    editor.commands.setTextSelection(pos + 1);
    expect(editor.view.dom.querySelectorAll(".stormmd-image-caret")).toHaveLength(1);
    editor.commands.setNodeSelection(pos);
    expect(editor.view.dom.querySelectorAll(".stormmd-image-caret")).toHaveLength(0);
    editor.commands.setTextSelection({ from: 1, to: pos + 1 });
    expect(editor.view.dom.querySelectorAll(".stormmd-image-caret")).toHaveLength(0);
    editor.commands.setTextSelection(pos);
    expect(editor.view.dom.querySelectorAll(".stormmd-image-caret")).toHaveLength(1);
    expect(editor.state.doc.textContent).toBe("Before  after");
  });

  it("moves the image to the drop cursor without duplication or losing its size", () => {
    const editor = create('Before ![Screenshot](/image.png "{width=320}") after\n\nTarget sentence');
    let target = 0;
    editor.state.doc.descendants((node, pos) => { if (node.isText && node.text === "Target sentence") target = pos + 7; });
    expect(target).toBeGreaterThan(0);
    vi.spyOn(editor.view, "posAtCoords").mockReturnValue({ pos: target, inside: -1 });
    const data = new Map<string, string>();
    const transfer = { files: [], setData: (type: string, value: string) => data.set(type, value), getData: (type: string) => data.get(type) ?? "", clearData: () => data.clear(), effectAllowed: "", types: ["text/html", "text/plain"] };
    const image = editor.view.dom.querySelector("img")!;
    expect(image.draggable).toBe(true);
    fireEvent(image, new MouseEvent("pointerdown", { bubbles: true }));
    fireEvent.dragStart(image, { dataTransfer: transfer });
    expect(editor.view.dragging).not.toBeNull();
    fireEvent.drop(editor.view.dom, { dataTransfer: transfer });
    const images: number[] = [];
    editor.state.doc.descendants((node) => { if (node.type.name === "image") images.push(node.attrs.width); });
    expect(images).toEqual([320]);
    const markdown = (editor.storage as unknown as { markdown: { getMarkdown: () => string } }).markdown.getMarkdown();
    expect(markdown).toContain('Target ![Screenshot](/image.png "{width=320}")sentence');
    expect(editor.state.doc.firstChild?.textContent).toBe("Before  after");
  });
});
