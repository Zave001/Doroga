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
// отдельный DOM-узел и лагает на hover/click, canvas рисует всё на одном
// холсте и делает попадание курсора через геометрию, а не DOM. tolerance
// расширяет зону клика/наведения вокруг тонкой линии (иначе физически трудно
// попасть в 1-2-пиксельную линию мышью) — работает только у canvas-рендерера.
const canvasRenderer = L.canvas({ padding: 0.5, tolerance: 8 });

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
  onSelectStreet: (name: string) => void;
}

// Рендерится только пока ничего не выбрано: все улицы разом наводимы/кликабельны.
// Как только что-то выбрано, этот слой размонтируется целиком (см. MapView) —
// иначе тысячи фоновых линий продолжали бы лагать вместе с выделенной.
function StreetLayers({ osmIndex, onSelectStreet }: StreetLayersProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const streetEntries = useMemo(
    () => Object.entries(osmIndex).filter(([, entry]) => entry.kind === 'way'),
    [osmIndex],
  );

  return (
    <>
      {streetEntries.map(([key, entry]) => {
        const isHovered = key === hoveredKey;
        return (
          <Polyline
            key={key}
            positions={entry.segments}
            pathOptions={{
              color: isHovered ? ACTIVE_COLOR : BASE_COLOR,
              weight: isHovered ? 6 : 2,
              opacity: isHovered ? 0.95 : 0.45,
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
      {osmIndex && !selectedEntry && (
        <StreetLayers osmIndex={osmIndex} onSelectStreet={onSelectStreet} />
      )}
      {selectedEntry && selectedEntry.kind === 'way' && (
        <Polyline
          positions={selectedEntry.segments}
          pathOptions={{ color: ACTIVE_COLOR, weight: 6, opacity: 0.95 }}
        >
          <Tooltip sticky direction="top" opacity={0.95}>
            {capitalizeFirst(selectedEntry.name)}
          </Tooltip>
        </Polyline>
      )}
      <FlyToEntry entry={selectedEntry} />
    </MapContainer>
  );
}
