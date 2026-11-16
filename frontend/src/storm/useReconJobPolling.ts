import { useEffect, useRef } from "react";

interface Job { id: number; status: string }
interface Options<T extends Job> {
  load: (projectId: number, jobId: number) => Promise<T>;
  update: (next: T) => void;
  retry: () => void;
  error: (error: unknown) => void;
}

/** Опрос задания: один таймер, отмена устаревшего ответа и повтор после сбоя.
 * Смена проекта/задания отменяет доставку результата. О сбое уведомляем один раз
 * до восстановления соединения; обработчик update управляет завершением задачи.
 */
export function useReconJobPolling<T extends Job>(job: T | null, projectId: number | null, options: Options<T>): void {
  const current = useRef(options);
  current.current = options;
  const selection = useRef("");
  selection.current = job && projectId != null && ["pending", "queued", "running"].includes(job.status) ? `${projectId}:${job.id}` : "";
  const failed = useRef<string | null>(null);
  useEffect(() => {
    if (!job || projectId == null || !["pending", "queued", "running"].includes(job.status)) return;
    let cancelled = false;
    const key = `${projectId}:${job.id}`;
    const timer = setTimeout(async () => {
      try {
        const next = await current.current.load(projectId, job.id);
        if (cancelled || selection.current !== key) return;
        failed.current = null;
        current.current.update(next);
      } catch (error) {
        if (cancelled || selection.current !== key) return;
        if (failed.current !== key) { failed.current = key; current.current.error(error); }
        current.current.retry();
      }
    }, 1500);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [job, projectId]);
}
