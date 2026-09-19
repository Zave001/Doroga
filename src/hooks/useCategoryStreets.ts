import { useCallback, useRef, useState } from 'react';
import { fetchCategoryMembers } from '../lib/mediawiki';
import type { CategoryDef, StreetItem } from '../types';

type Status = 'idle' | 'loading' | 'done';

export function useCategoryStreets() {
  const [itemsByCategory, setItemsByCategory] = useState<Record<string, StreetItem[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const status = useRef<Record<string, Status>>({});

  const ensureLoaded = useCallback((def: CategoryDef) => {
    if (status.current[def.key] === 'loading' || status.current[def.key] === 'done') return;

    if (def.staticItems) {
      status.current[def.key] = 'done';
      setItemsByCategory((prev) => ({ ...prev, [def.key]: def.staticItems! }));
      return;
    }

    if (!def.wikiCategory) {
      status.current[def.key] = 'done';
      return;
    }

    status.current[def.key] = 'loading';
    setLoading((prev) => ({ ...prev, [def.key]: true }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[def.key];
      return next;
    });

    fetchCategoryMembers(def.wikiCategory)
      .then((titles) => {
        status.current[def.key] = 'done';
        const items: StreetItem[] = titles.map((title) => ({
          name: title,
          category: def.key,
          hasWikiPage: true,
        }));
        setItemsByCategory((prev) => ({ ...prev, [def.key]: items }));
      })
      .catch((err: unknown) => {
        status.current[def.key] = 'idle';
        setErrors((prev) => ({
          ...prev,
          [def.key]: err instanceof Error ? err.message : 'Ошибка загрузки',
        }));
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, [def.key]: false }));
      });
  }, []);

  return { itemsByCategory, loading, errors, ensureLoaded };
}
