import type { OsmStreetEntry } from '../types';
import { candidateKeys } from './normalize';

let indexPromise: Promise<Record<string, OsmStreetEntry>> | null = null;

export function loadOsmIndex(): Promise<Record<string, OsmStreetEntry>> {
  if (!indexPromise) {
    indexPromise = fetch(`${import.meta.env.BASE_URL}data/osm-streets.json`).then((r) => {
      if (!r.ok) throw new Error(`Не удалось загрузить osm-streets.json: ${r.status}`);
      return r.json();
    });
  }
  return indexPromise;
}

export function matchOsmKey(index: Record<string, OsmStreetEntry>, name: string): string | null {
  for (const key of candidateKeys(name)) {
    if (index[key]) return key;
  }
  return null;
}

export function matchOsm(index: Record<string, OsmStreetEntry>, name: string): OsmStreetEntry | null {
  const key = matchOsmKey(index, name);
  return key ? index[key] : null;
}
