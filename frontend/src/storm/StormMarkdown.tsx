import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { markdownUrlTransform, normalizeMarkdownForRender } from '../markdownUrlTransform';
import { imageTitleSize } from './imageSize';

/** GFM-таблицы, списки и изображения; HTML и опасные URL не исполняются. */
export function StormMarkdown({ value }: { value: string }) {
  return <div className="storm-markdown" style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--st-text-2)' }}>
    <ReactMarkdown remarkPlugins={[remarkGfm]} urlTransform={markdownUrlTransform} components={{
      table: ({ children }) => <div className="stormmd-table-wrap"><table>{children}</table></div>,
      a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
      img: ({ src, alt, title }) => {
        const metadata = imageTitleSize(title);
        return src ? <a href={src} target="_blank" rel="noopener noreferrer"><img src={src} alt={alt || ''} width={metadata.width ?? undefined} title={metadata.title || undefined} style={{ height: 'auto', maxWidth: '100%', borderRadius: 8, border: '1px solid var(--st-border)', cursor: 'zoom-in', verticalAlign: 'bottom' }} /></a> : null;
      },
    }}>{normalizeMarkdownForRender(value)}</ReactMarkdown>
  </div>;
}

export default StormMarkdown;
