import { useState } from 'react';

/** Фото пользователя с первой буквой логина при отсутствии или ошибке загрузки изображения. */
export function UserAvatar({ name, src, initials, size = 32, fontSize = 12, background = 'var(--st-accent)' }: {
  name: string; src?: string | null; initials: string; size?: number; fontSize?: number; background?: string;
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  return <span className="mono user-avatar" style={{ width: size, height: size, flex: 'none', borderRadius: '50%', background, color: 'var(--st-on-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontSize, fontWeight: 700 }}>
    {src && src !== failedSource ? <img src={src} alt={name} onError={() => setFailedSource(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : initials}
  </span>;
}
