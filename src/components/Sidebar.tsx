import { useState } from 'react';
import type { CategoryDef, StreetItem } from '../types';

interface Props {
  categories: CategoryDef[];
  itemsByCategory: Record<string, StreetItem[]>;
  loading: Record<string, boolean>;
  errors: Record<string, string>;
  onExpand: (def: CategoryDef) => void;
  onSelect: (item: StreetItem) => void;
  selected: StreetItem | null;
}

export function Sidebar({ categories, itemsByCategory, loading, errors, onExpand, onSelect, selected }: Props) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const toggle = (def: CategoryDef) => {
    const next = openKey === def.key ? null : def.key;
    setOpenKey(next);
    if (next) onExpand(def);
  };

  return (
    <nav className="sidebar">
      <div className="sidebar__header">
        <h1>Узнаю дорогу.рф</h1>
        <p>Улицы Томска из towiki.ru на карте OpenStreetMap</p>
        <input
          className="sidebar__search"
          placeholder="Поиск в открытых разделах…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <ul className="category-list">
        {categories.map((def) => {
          const items = itemsByCategory[def.key] ?? [];
          const filtered = query
            ? items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()))
            : items;
          const isOpen = openKey === def.key;

          return (
            <li key={def.key} className="category">
              <button type="button" className="category__header" onClick={() => toggle(def)}>
                <span>{def.title}</span>
                {loading[def.key] ? (
                  <span className="spinner" aria-label="Загрузка" />
                ) : (
                  <span className="count">{items.length || ''}</span>
                )}
              </button>
              {isOpen && (
                <ul className="street-list">
                  {errors[def.key] && <li className="street-list__error">Ошибка: {errors[def.key]}</li>}
                  {filtered.map((streetItem) => (
                    <li key={streetItem.name}>
                      <button
                        type="button"
                        className={[
                          'street-item',
                          selected?.name === streetItem.name ? 'is-active' : '',
                          !streetItem.hasWikiPage ? 'is-empty' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() => onSelect(streetItem)}
                      >
                        {streetItem.name}
                      </button>
                    </li>
                  ))}
                  {!loading[def.key] && filtered.length === 0 && !errors[def.key] && (
                    <li className="street-list__empty">Ничего не найдено</li>
                  )}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
