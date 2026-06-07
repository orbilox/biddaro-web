'use client';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useEffect } from 'react';

// Fix Leaflet default icon paths broken by Webpack
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface CapturePoint {
  id: string;
  lat: number;
  lng: number;
  severity: string;
  content: string | null;
  section: string | null;
  type: string;
  imageUrl: string | null;
}

const SEV_COLOR: Record<string, string> = {
  critical: '#ef4444',
  warning:  '#f59e0b',
  normal:   '#22c55e',
};

export default function CaptureMap({ captures }: { captures: CapturePoint[] }) {
  // Compute centre of all points
  const lats = captures.map(c => c.lat);
  const lngs = captures.map(c => c.lng);
  const centre: [number, number] = [
    (Math.min(...lats) + Math.max(...lats)) / 2,
    (Math.min(...lngs) + Math.max(...lngs)) / 2,
  ];

  if (captures.length === 0) return null;

  return (
    <MapContainer
      center={centre}
      zoom={17}
      style={{ height: '420px', width: '100%', borderRadius: '16px' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {captures.map(c => (
        <CircleMarker
          key={c.id}
          center={[c.lat, c.lng]}
          radius={9}
          pathOptions={{
            color: SEV_COLOR[c.severity] ?? '#6b7280',
            fillColor: SEV_COLOR[c.severity] ?? '#6b7280',
            fillOpacity: 0.85,
            weight: 2,
          }}
        >
          <Popup maxWidth={260}>
            <div className="text-xs space-y-1.5">
              {c.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.imageUrl} alt="" className="w-full h-28 object-cover rounded-lg mb-2" />
              )}
              {c.section && (
                <p className="font-bold text-dark-700 uppercase tracking-wide text-[10px]">{c.section}</p>
              )}
              <p className="text-dark-700 leading-snug">{c.content ?? `${c.type} capture`}</p>
              <p className={`font-bold capitalize text-[10px] ${
                c.severity === 'critical' ? 'text-red-600' :
                c.severity === 'warning'  ? 'text-amber-600' : 'text-green-600'
              }`}>
                {c.severity}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
