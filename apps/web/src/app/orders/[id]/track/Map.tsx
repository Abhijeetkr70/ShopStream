"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const icon = L.divIcon({
  className: "",
  html: `<div style="background:#FF5200;width:18px;height:18px;border-radius:9999px;border:3px solid white;box-shadow:0 4px 10px rgba(15,23,42,0.2)"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export default function Map({
  coords,
}: {
  coords: { lat: number; lng: number } | null;
}) {
  const center: [number, number] = coords
    ? [coords.lat, coords.lng]
    : [12.9716, 77.5946];

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {coords && (
        <Marker position={[coords.lat, coords.lng]} icon={icon}>
          <Popup>Live courier location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
