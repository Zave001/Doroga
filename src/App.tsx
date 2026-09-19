import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { InfoPanel } from './components/InfoPanel';
import { MapView } from './components/MapView';
import { Sidebar } from './components/Sidebar';
import { CATEGORIES } from './data/categories';
import { useCategoryStreets } from './hooks/useCategoryStreets';
import { capitalizeFirst, normalizeName } from './lib/normalize';
import { loadOsmIndex, matchOsmKey } from './lib/osmMatch';
import type { OsmStreetEntry, StreetItem } from './types';

function App() {
  const { itemsByCategory, loading, errors, ensureLoaded } = useCategoryStreets();
  const [osmIndex, setOsmIndex] = useState<Record<string, OsmStreetEntry> | null>(null);
  const [selected, setSelected] = useState<StreetItem | null>(null);

  useEffect(() => {
    loadOsmIndex()
      .then(setOsmIndex)
      .catch(() => setOsmIndex({}));
  }, []);

  const selectedKey = useMemo(() => {
    if (!selected || !osmIndex) return null;
    return matchOsmKey(osmIndex, selected.name);
  }, [selected, osmIndex]);

  const selectedEntry = selectedKey && osmIndex ? (osmIndex[selectedKey] ?? null) : null;

  // Имя может прийти со страницы статьи (уже в стиле towiki, "Проспект Ленина")
  // или прямо с карты (в стиле OSM, "проспект Ленина") — сравниваем без учёта
  // регистра/оформления и, если объект уже загружен в сайдбаре, переиспользуем
  // его карточку вместо временной.
  const selectByName = (rawName: string) => {
    const displayName = capitalizeFirst(rawName);
    const targetKey = normalizeName(displayName);
    const known = Object.values(itemsByCategory)
      .flat()
      .find((candidate) => normalizeName(candidate.name) === targetKey);
    setSelected(known ?? { name: displayName, category: 'unknown', hasWikiPage: true });
  };

  return (
    <div className="app">
      <Sidebar
        categories={CATEGORIES}
        itemsByCategory={itemsByCategory}
        loading={loading}
        errors={errors}
        onExpand={ensureLoaded}
        onSelect={setSelected}
        selected={selected}
      />
      <main className="map-area">
        <MapView osmIndex={osmIndex} selectedKey={selectedKey} onSelectStreet={selectByName} />
      </main>
      {selected && (
        <InfoPanel
          street={selected}
          osmEntry={selectedEntry}
          onNavigate={selectByName}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

export default App;
