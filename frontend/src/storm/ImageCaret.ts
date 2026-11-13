import { Plugin, PluginKey, TextSelection, type EditorState } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

/** The browser can paint a full-height, split caret beside a non-editable image.
 * Keep the real text selection/input; replace only its visual indicator there.
 * A view decoration never becomes text in the document or saved Markdown.
 */
const imageCaretPosition = (state: EditorState): number | null => {
  const { selection } = state;
  if (!(selection instanceof TextSelection) || !selection.empty) return null;
  const { nodeBefore, nodeAfter } = selection.$head;
  return nodeBefore?.type.name === "image" || nodeAfter?.type.name === "image" ? selection.head : null;
};

export const imageCaretPlugin = () => new Plugin({
  key: new PluginKey("stormImageCaret"),
  props: {
    attributes: (state): Record<string, string> => imageCaretPosition(state) === null ? {} : { class: "stormmd-image-caret-active" },
    decorations: (state) => {
      const pos = imageCaretPosition(state);
      if (pos === null) return DecorationSet.empty;
      return DecorationSet.create(state.doc, [Decoration.widget(pos, () => {
        const caret = document.createElement("span");
        caret.className = "stormmd-image-caret";
        caret.setAttribute("aria-hidden", "true");
        return caret;
      }, { key: "storm-image-caret", side: 1, ignoreSelection: true })]);
    },
  },
});
