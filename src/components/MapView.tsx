import { useEffect } from 'react';
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { OsmStreetEntry } from '../types';

const TOMSK_CENTER: [number, number] = [56.4846, 84.9476];

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

interface Props {
  entry: OsmStreetEntry | null;
}

export function MapView({ entry }: Props) {
  return (
    <MapContainer center={TOMSK_CENTER} zoom={12} className="map" scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {entry?.kind === 'way' &&
        entry.segments.map((segment, i) => (
          <Polyline key={i} positions={segment} pathOptions={{ color: '#e63946', weight: 5, opacity: 0.85 }} />
        ))}
      {entry?.kind === 'place' && (
        <CircleMarker center={entry.center} radius={12} pathOptions={{ color: '#e63946', weight: 2, fillOpacity: 0.5 }}>
          <Popup>{entry.name}</Popup>
        </CircleMarker>
      )}
      <FlyToEntry entry={entry} />
    </MapContainer>
  );
}
