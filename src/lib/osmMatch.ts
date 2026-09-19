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

export function matchOsm(index: Record<string, OsmStreetEntry>, name: string): OsmStreetEntry | null {
  for (const key of candidateKeys(name)) {
    const found = index[key];
    if (found) return found;
  }
  return null;
}
