import Image from "@tiptap/extension-image";
import type { NodeViewRendererProps } from "@tiptap/core";
import type { Node as PMNode } from "@tiptap/pm/model";
import { markdownUrlTransform } from "../markdownUrlTransform";
import { imageTitleSize, sizedImageTitle } from "./imageSize";
import { imageCaretPlugin } from "./ImageCaret";
import { t } from "./i18n";

export const ResizableImage = Image.extend({
  addProseMirrorPlugins() {
    return [...(this.parent?.() ?? []), imageCaretPlugin()];
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      title: { default: null, parseHTML: (element: HTMLElement) => imageTitleSize(element.getAttribute("title")).title || null },
      width: {
        default: null,
        parseHTML: (element: HTMLElement) => imageTitleSize(element.getAttribute("title")).width ?? (Number(element.getAttribute("width")) || null),
      },
    };
  },
  addStorage() {
    return { markdown: { serialize: (state: { write: (value: string) => void; esc: (value: string) => string }, node: PMNode) => {
      const title = sizedImageTitle(node.attrs.title, node.attrs.width);
      const source = String(node.attrs.src ?? "").replace(/[()]/g, "\\$&");
      state.write(`![${state.esc(node.attrs.alt || "")}](${source}${title ? ` "${title.replace(/"/g, '\\"')}"` : ""})`);
    } } };
  },
  addNodeView() {
    return ({ node, editor, getPos }: NodeViewRendererProps) => {
      let current = node;
      let cleanupDrag: (() => void) | null = null;
      const dom = document.createElement("span");
      dom.className = "stormmd-image";
      dom.contentEditable = "false";
      const frame = document.createElement("span");
      frame.className = "stormmd-image-frame";
      const image = document.createElement("img");
      image.draggable = true;
      dom.draggable = true;
      image.className = "stormmd-img";
      frame.append(image);
      dom.append(frame);
      const handles: HTMLButtonElement[] = [];
      const select = (selected: boolean) => {
        dom.classList.toggle("selected", selected);
        for (const handle of handles) handle.hidden = !selected;
      };
      const paint = () => {
        image.src = markdownUrlTransform(current.attrs.src ?? "");
        image.alt = current.attrs.alt ?? "";
        image.title = imageTitleSize(current.attrs.title).title;
        frame.style.width = current.attrs.width ? `${current.attrs.width}px` : "";
      };
      const selectImage = () => {
        const pos = getPos();
        if (typeof pos !== "number" || !editor.isEditable) return;
        editor.commands.setNodeSelection(pos);
        editor.view.focus();
        select(true);
      };
      image.addEventListener("pointerdown", (event) => { event.stopPropagation(); selectImage(); });
      dom.addEventListener("click", (event) => event.stopPropagation());
      for (const corner of ["nw", "ne", "sw", "se"]) {
        const handle = document.createElement("button");
        handle.type = "button";
        handle.className = `stormmd-resize ${corner}`;
        handle.setAttribute("aria-label", `${t("Resize image")}: ${corner}`);
        handle.hidden = true;
        handles.push(handle);
        frame.append(handle);
        handle.addEventListener("pointerdown", (event) => {
          if (!editor.isEditable) return;
          event.preventDefault();
          event.stopPropagation();
          cleanupDrag?.();
          selectImage();
          const rect = image.getBoundingClientRect();
          const startWidth = rect.width || Number(current.attrs.width) || image.naturalWidth || 320;
          const ratio = rect.height && rect.width ? rect.height / rect.width : image.naturalHeight && image.naturalWidth ? image.naturalHeight / image.naturalWidth : 0.75;
          const limit = Math.max(64, editor.view.dom.getBoundingClientRect().width || editor.view.dom.clientWidth || 1200);
          let width = startWidth;
          const move = (next: PointerEvent) => {
            const dx = (next.clientX - event.clientX) * (corner.endsWith("e") ? 1 : -1);
            const dy = (next.clientY - event.clientY) * (corner.startsWith("s") ? 1 : -1) / ratio;
            width = Math.round(Math.max(64, Math.min(limit, startWidth + (Math.abs(dx) >= Math.abs(dy) ? dx : dy))));
            frame.style.width = `${width}px`;
          };
          const removeListeners = () => {
            document.removeEventListener("pointermove", move);
            document.removeEventListener("pointerup", finish);
            document.removeEventListener("pointercancel", cancel);
            window.removeEventListener("blur", cancel);
            cleanupDrag = null;
          };
          const finish = () => {
            removeListeners();
            const pos = getPos();
            if (typeof pos === "number" && !editor.isDestroyed) editor.view.dispatch(editor.state.tr.setNodeMarkup(pos, undefined, { ...current.attrs, width }));
          };
          const cancel = () => { removeListeners(); paint(); };
          cleanupDrag = cancel;
          document.addEventListener("pointermove", move);
          document.addEventListener("pointerup", finish);
          document.addEventListener("pointercancel", cancel);
          window.addEventListener("blur", cancel);
        });
      }
      const outside = (event: PointerEvent) => {
        if (dom.contains(event.target as Node)) return;
        select(false);
        const rect = image.getBoundingClientRect();
        const pos = getPos();
        if (!editor.isEditable || typeof pos !== "number" || !current.isInline || !rect.width) return;
        if (!dom.parentElement?.contains(event.target as Node) && event.target !== editor.view.dom) return;
        if (event.clientX < rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return;
        const after = pos + current.nodeSize;
        const resolved = editor.state.doc.resolve(after);
        if (resolved.parentOffset !== resolved.parent.content.size) return;
        editor.commands.setTextSelection(after);
        editor.view.focus();
      };
      document.addEventListener("pointerdown", outside);
      paint();
      return {
        dom,
        selectNode: () => { if (editor.isFocused) select(true); },
        deselectNode: () => select(false),
        update: (next: PMNode) => { if (next.type !== current.type) return false; current = next; paint(); return true; },
        // Перенос узла и курсор вставки обслуживает штатный механизм ProseMirror.
        stopEvent: (event: Event) => !event.type.startsWith("drag") && event.type !== "drop" && dom.contains(event.target as Node),
        ignoreMutation: () => true,
        destroy: () => { cleanupDrag?.(); document.removeEventListener("pointerdown", outside); },
      };
    };
  },
});
