"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with webpack/Next.js
if (typeof window !== 'undefined') {
  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
  });

  L.Marker.prototype.options.icon = defaultIcon;
}

const redIcon = (typeof window !== 'undefined') ? L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
}) : null;

interface MarkerData {
  position: [number, number];
  label: string;
  type?: 'patient' | 'ambulance' | 'hospital';
}

interface LeafletMapProps {
  center: [number, number];
  zoom?: number;
  markers?: MarkerData[];
  polyLine?: [number, number][];
  height?: string;
}

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function LeafletMap({ center, zoom = 13, markers = [], polyLine, height = '400px' }: LeafletMapProps) {
  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      scrollWheelZoom={true} 
      style={{ height, width: '100%', zIndex: 1 }}
      className="rounded-lg shadow-sm border border-gray-200"
    >
      <ChangeView center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {markers.map((m, idx) => (
        <Marker 
          key={idx} 
          position={m.position} 
          icon={(m.type === 'patient' || m.type === 'hospital') && redIcon ? redIcon : undefined}
        >
          <Popup>{m.label}</Popup>
        </Marker>
      ))}

      {polyLine && <Polyline positions={polyLine as any} pathOptions={{ color: 'red', weight: 5 }} />}
    </MapContainer>
  );
}
