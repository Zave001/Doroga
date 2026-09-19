export type CategoryKey =
  | 'street'
  | 'avenue'
  | 'trakt'
  | 'lane'
  | 'passage'
  | 'square'
  | 'settlement'
  | 'microdistrict'
  | 'embankment'
  | 'ascent'
  | 'deadend'
  | 'town'
  | 'row'
  | 'exotic'
  | 'unknown';

export interface StreetItem {
  name: string;
  category: CategoryKey;
  hasWikiPage: boolean;
}

export interface CategoryDef {
  key: CategoryKey;
  title: string;
  wikiCategory?: string;
  staticItems?: StreetItem[];
}

export interface OsmStreetEntry {
  name: string;
  kind: 'way' | 'place';
  place: string | null;
  center: [number, number];
  bounds: [[number, number], [number, number]];
  segments: [number, number][][];
}
