import { useEffect, useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { capitalizeFirst } from '../lib/normalize';
import type { OsmStreetEntry } from '../types';

const TOMSK_CENTER: [number, number] = [56.4846, 84.9476];

const BASE_COLOR = '#5b7fa6';
const ACTIVE_COLOR = '#e63946';

const PLACE_LABELS: Record<string, string> = {
  neighbourhood: 'микрорайон',
  suburb: 'район',
  village: 'посёлок',
  hamlet: 'посёлок',
  quarter: 'квартал',
  isolated_dwelling: 'урочище',
};

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
  const entries = useMemo(() => Object.entries(osmIndex), [osmIndex]);

  return (
    <>
      {entries.map(([key, entry]) => {
        const isActive = key === selectedKey || key === hoveredKey;
        const label = capitalizeFirst(entry.name);
        const eventHandlers = {
          mouseover: () => setHoveredKey(key),
          mouseout: () => setHoveredKey((current) => (current === key ? null : current)),
          click: () => onSelectStreet(entry.name),
        };

        if (entry.kind === 'way') {
          return entry.segments.map((segment, i) => (
            <Polyline
              key={`${key}-${i}`}
              positions={segment}
              pathOptions={{
                color: isActive ? ACTIVE_COLOR : BASE_COLOR,
                weight: isActive ? 6 : 2,
                opacity: isActive ? 0.95 : 0.45,
              }}
              eventHandlers={eventHandlers}
            >
              <Tooltip sticky direction="top" opacity={0.95}>
                {label}
              </Tooltip>
            </Polyline>
          ));
        }

        return (
          <CircleMarker
            key={key}
            center={entry.center}
            radius={isActive ? 11 : 3}
            pathOptions={{
              color: isActive ? ACTIVE_COLOR : BASE_COLOR,
              weight: isActive ? 2 : 1,
              opacity: isActive ? 1 : 0.5,
              fillOpacity: isActive ? 0.6 : 0.2,
            }}
            eventHandlers={eventHandlers}
          >
            <Tooltip sticky direction="top" opacity={0.95}>
              {label}
              {entry.place ? ` · ${PLACE_LABELS[entry.place] ?? entry.place}` : ''}
            </Tooltip>
          </CircleMarker>
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
    <MapContainer center={TOMSK_CENTER} zoom={12} className="map" scrollWheelZoom>
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
