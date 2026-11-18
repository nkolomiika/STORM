import { useEffect, useRef, useState } from "react";
import { createEndpointComment, getApiErrorMessage, listEndpointComments } from "../api";
import { useToastStore } from "../store";
import type { EndpointComment } from "../types";
import { t } from "./i18n";

interface Props { projectId: number; hostId: number; endpointId: number }

/** Persisted discussion, isolated from raw-request editing and its save button. */
export function EndpointDiscussion({ projectId, hostId, endpointId }: Props) {
  const [comments, setComments] = useState<EndpointComment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [posting, setPosting] = useState(false);
  const version = useRef(0);
  const postingLock = useRef(false);
  const retryPage = useRef(1);
  const pushToast = useToastStore((state) => state.pushToast);

  const loadPage = async (nextPage: number) => {
    const requestVersion = version.current;
    retryPage.current = nextPage;
    setLoading(true);
    setLoadError(false);
    try {
      const response = await listEndpointComments(projectId, hostId, endpointId, nextPage);
      if (version.current !== requestVersion) return;
      setComments((previous) => {
        if (nextPage === 1) return response.items;
        const ids = new Set(previous.map((comment) => comment.id));
        return [...previous, ...response.items.filter((comment) => !ids.has(comment.id))];
      });
      setTotal(response.total);
      setPage(response.page);
    } catch (error) {
      if (version.current !== requestVersion) return;
      setLoadError(true);
      pushToast(getApiErrorMessage(error, t("Couldn't load comments")), "error");
    } finally {
      if (version.current === requestVersion) setLoading(false);
    }
  };

  useEffect(() => {
    version.current++;
    setComments([]);
    setTotal(0);
    setPage(0);
    setDraft("");
    setPosting(false);
    postingLock.current = false;
    void loadPage(1);
    return () => { version.current++; };
    // Each endpoint owns its request lifetime; old responses cannot fill a new discussion.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, hostId, endpointId]);

  const postComment = async () => {
    const content = draft.trim();
    if (!content || loading || postingLock.current) return;
    postingLock.current = true;
    const requestVersion = version.current;
    setPosting(true);
    try {
      const saved = await createEndpointComment(projectId, hostId, endpointId, content);
      if (version.current !== requestVersion) return;
      setComments((previous) => [saved, ...previous.filter((comment) => comment.id !== saved.id)]);
      setTotal((count) => count + 1);
      setDraft("");
      pushToast(t("Comment posted"), "success");
    } catch (error) {
      if (version.current === requestVersion) pushToast(getApiErrorMessage(error, t("Couldn't post comment")), "error");
    } finally {
      if (version.current === requestVersion) { postingLock.current = false; setPosting(false); }
    }
  };
  const disabled = loading || posting || !draft.trim();

  return <section aria-label={t("Endpoint discussion")}>
    <div className="mono" style={{ fontSize: 10.5, letterSpacing: 1, color: "var(--st-text-faint)", fontWeight: 700, marginBottom: 10 }}>{t("DISCUSSION")}</div>
    <div aria-live="polite" style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
      {comments.map((comment) => <article key={comment.id} className="discussion-comment" style={{ background: "var(--st-hover)", border: "1px solid var(--st-divider)", borderRadius: 12, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
          <b style={{ fontSize: 13, color: "var(--st-text)" }}>{comment.username}</b>
          <time dateTime={comment.created_at} style={{ fontSize: 11, color: "var(--st-text-faint)" }}>{new Date(comment.created_at).toLocaleString()}</time>
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap", overflowWrap: "anywhere", color: "var(--st-text-2)" }}>{comment.content}</div>
      </article>)}
      {!loading && !loadError && comments.length === 0 && <div style={{ background: "var(--st-hover)", border: "1px solid var(--st-divider)", borderRadius: 12, padding: 16, fontSize: 13, color: "var(--st-text-3)" }}>{t("No comments yet — start the discussion.")}</div>}
      {loading && <div role="status" style={{ fontSize: 13, color: "var(--st-text-faint)" }}>{t("Loading comments…")}</div>}
      {loadError && <button type="button" disabled={loading || posting} onClick={() => void loadPage(retryPage.current)} className="addbtn">{t("Retry loading comments")}</button>}
      {!loadError && comments.length < total && <button type="button" disabled={loading || posting} onClick={() => void loadPage(page + 1)} className="addbtn">{t("Load more comments")}</button>}
    </div>
    <textarea className="finp" aria-label={t("Endpoint comment")} rows={3} placeholder={t("Share progress, blockers, or review notes…")} value={draft} disabled={posting} onChange={(event) => setDraft(event.target.value)} />
    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
      <button type="button" disabled={disabled} onClick={() => void postComment()} style={{ height: 40, padding: "0 18px", border: "none", borderRadius: 10, background: "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13px Inter,sans-serif", cursor: disabled ? "default" : "pointer", opacity: disabled ? .45 : 1 }}>{posting ? t("Posting…") : t("Post comment")}</button>
    </div>
  </section>;
}
