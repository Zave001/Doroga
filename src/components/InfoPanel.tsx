import DOMPurify from 'dompurify';
import type { MouseEvent } from 'react';
import { CATEGORY_LABELS } from '../data/categories';
import { useArticle } from '../hooks/useArticle';
import { parseWikiHref } from '../lib/mediawiki';
import type { OsmStreetEntry, StreetItem } from '../types';

interface Props {
  street: StreetItem;
  osmEntry: OsmStreetEntry | null;
  onNavigate: (name: string) => void;
  onClose: () => void;
}

export function InfoPanel({ street, osmEntry, onNavigate, onClose }: Props) {
  const { data, loading, error } = useArticle(street.hasWikiPage ? street.name : null);

  // Статьи towiki редактируют третьи лица — санитизируем HTML перед вставкой,
  // а внутренние ссылки на другие улицы/здания перехватываем и ведём по ним
  // внутри приложения (карта + новая карточка) вместо перехода на towiki.ru.
  const handleContentClick = (event: MouseEvent<HTMLDivElement>) => {
    const anchor = (event.target as HTMLElement).closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href) return;

    const parsed = parseWikiHref(href);
    if (parsed) {
      event.preventDefault();
      onNavigate(parsed.title);
    } else {
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('rel', 'noopener noreferrer');
    }
  };

  const sanitizedHtml = data ? DOMPurify.sanitize(data.html) : '';
  const wikiUrl = `https://towiki.ru/view/${encodeURIComponent(street.name.replace(/ /g, '_'))}`;

  return (
    <aside className="info-panel">
      <button type="button" className="info-panel__close" onClick={onClose} aria-label="Закрыть">
        ×
      </button>
      <h2>{street.name}</h2>
      <div className="info-panel__badges">
        <span className="badge">{CATEGORY_LABELS[street.category] ?? 'Объект'}</span>
        <span className={`badge ${osmEntry ? 'badge--ok' : 'badge--warn'}`}>
          {osmEntry ? 'Есть на карте' : 'Нет на карте'}
        </span>
      </div>
      <a className="info-panel__source" href={wikiUrl} target="_blank" rel="noopener noreferrer">
        Открыть статью на towiki.ru →
      </a>

      {!street.hasWikiPage && <p className="info-panel__empty">Статья на towiki ещё не написана.</p>}
      {loading && <p className="info-panel__status">Загрузка статьи…</p>}
      {error && <p className="info-panel__error">Не удалось загрузить статью: {error}</p>}
      {sanitizedHtml && (
        <div
          className="info-panel__content"
          onClick={handleContentClick}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      )}
    </aside>
  );
}
