import L from 'leaflet';
import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { capitalizeFirst } from '../lib/normalize';
import type { OsmStreetEntry } from '../types';

const TOMSK_CENTER: [number, number] = [56.4846, 84.9476];

const BASE_COLOR = '#5b7fa6';
const ACTIVE_COLOR = '#e63946';

// Canvas вместо SVG: при ~1500 линиях по всему городу SVG рендерит каждую как
// отдельный DOM-узел и лагает на hover/click, canvas рисует все на одном
// холсте и делает попадание курсора через геометрию, а не DOM.
const canvasRenderer = L.canvas({ padding: 0.5 });

function FlyToEntry({ entry }: { entry: OsmStreetEntry | null }) {
  const map = useMap();

  useEffect(() => {
    if (!entry) return;
    const [[minLat, minLon], [maxLat, maxLon]] = entry.bounds;
    if (minLat === maxLat && minLon === maxLon) {
      map.flyTo(entry.center, 16, { duration: 0.8 });
    } else {
      map.flyToBounds(
        [
          [minLat, minLon],
          [maxLat, maxLon],
        ],
        { padding: [48, 48], duration: 0.8, maxZoom: 17 },
      );
    }
  }, [entry, map]);

  return null;
}

interface StreetLayersProps {
  osmIndex: Record<string, OsmStreetEntry>;
  selectedKey: string | null;
  onSelectStreet: (name: string) => void;
}

function StreetLayers({ osmIndex, selectedKey, onSelectStreet }: StreetLayersProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  // Только улицы/линейные объекты — точечные "place" (посёлки, микрорайоны)
  // не рисуем на карте вовсе, по запросу. Сегменты одной улицы объединены в
  // один Polyline (positions как массив линий), а не по слою на сегмент —
  // это на порядок меньше слоёв, чем было.
  const streetEntries = useMemo(
    () => Object.entries(osmIndex).filter(([, entry]) => entry.kind === 'way'),
    [osmIndex],
  );

  return (
    <>
      {streetEntries.map(([key, entry]) => {
        const isActive = key === selectedKey || key === hoveredKey;
        return (
          <Polyline
            key={key}
            positions={entry.segments}
            pathOptions={{
              color: isActive ? ACTIVE_COLOR : BASE_COLOR,
              weight: isActive ? 6 : 2,
              opacity: isActive ? 0.95 : 0.45,
            }}
            eventHandlers={{
              mouseover: () => setHoveredKey(key),
              mouseout: () => setHoveredKey((current) => (current === key ? null : current)),
              click: () => onSelectStreet(entry.name),
            }}
          >
            <Tooltip sticky direction="top" opacity={0.95}>
              {capitalizeFirst(entry.name)}
            </Tooltip>
          </Polyline>
        );
      })}
    </>
  );
}

interface Props {
  osmIndex: Record<string, OsmStreetEntry> | null;
  selectedKey: string | null;
  onSelectStreet: (name: string) => void;
}

export function MapView({ osmIndex, selectedKey, onSelectStreet }: Props) {
  const selectedEntry = selectedKey && osmIndex ? (osmIndex[selectedKey] ?? null) : null;

  return (
    <MapContainer
      center={TOMSK_CENTER}
      zoom={12}
      className="map"
      scrollWheelZoom
      renderer={canvasRenderer}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {osmIndex && (
        <StreetLayers osmIndex={osmIndex} selectedKey={selectedKey} onSelectStreet={onSelectStreet} />
      )}
      <FlyToEntry entry={selectedEntry} />
    </MapContainer>
  );
}
