'use client';

import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface Location {
  lat: number;
  lng: number;
}

interface OriginMapProps {
  origin: Location;
  onOriginChange?: (location: Location) => void;
  isEditable?: boolean;
}

const mapContainerStyle = {
  width: '100%',
  height: '300px'
};

export default function OriginMapComponent({
  origin,
  onOriginChange,
  isEditable = false
}: OriginMapProps) {
  const [marker, setMarker] = useState<Location>(origin);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (!isEditable) return;
    
    if (event.latLng) {
      const newLocation: Location = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      
      setMarker(newLocation);
      onOriginChange?.(newLocation);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-brand-black mb-2">
          Ubicación de Origen
        </h3>
        <p className="text-sm text-brand-black">
          {isEditable ? 'Haz clic en el mapa para cambiar la ubicación de origen' : 'Ubicación actual de origen'}
        </p>
      </div>

      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={marker}
          zoom={12}
          onClick={handleMapClick}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: true,
            fullscreenControl: true,
          }}
        >
          <Marker
            position={marker}
            animation={google.maps.Animation.DROP}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new google.maps.Size(40, 40)
            }}
          />
        </GoogleMap>
      </LoadScript>
      
      <div className="mt-4 p-3 bg-brand-beige rounded-lg border border-brand-black">
        <p className="text-sm text-brand-black">
          <strong>Coordenadas actuales:</strong>
        </p>
        <p className="text-xs text-brand-black">
          Lat: {marker.lat.toFixed(6)}, Lng: {marker.lng.toFixed(6)}
        </p>
      </div>
    </div>
  );
}
