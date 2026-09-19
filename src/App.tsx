import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { InfoPanel } from './components/InfoPanel';
import { MapView } from './components/MapView';
import { Sidebar } from './components/Sidebar';
import { CATEGORIES } from './data/categories';
import { useCategoryStreets } from './hooks/useCategoryStreets';
import { loadOsmIndex, matchOsm } from './lib/osmMatch';
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

  const selectedEntry = useMemo(() => {
    if (!selected || !osmIndex) return null;
    return matchOsm(osmIndex, selected.name);
  }, [selected, osmIndex]);

  // Ссылка внутри статьи может вести на объект, категория которого ещё не
  // раскрыта в сайдбаре — тогда создаём временный StreetItem "на лету".
  const handleNavigate = (name: string) => {
    const known = Object.values(itemsByCategory)
      .flat()
      .find((candidate) => candidate.name === name);
    setSelected(known ?? { name, category: 'unknown', hasWikiPage: true });
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
        <MapView entry={selectedEntry} />
      </main>
      {selected && (
        <InfoPanel
          street={selected}
          osmEntry={selectedEntry}
          onNavigate={handleNavigate}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

export default App;
