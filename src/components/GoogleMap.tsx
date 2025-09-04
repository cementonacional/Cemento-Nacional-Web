'use client';

import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import GoogleMapsProvider, { useGoogleMaps } from './GoogleMapsProvider';

interface Location {
  lat: number;
  lng: number;
}

interface GoogleMapProps {
  onLocationSelect?: (location: Location) => void;
  initialCenter?: Location;
  selectedLocation?: Location | null;
  height?: string;
  width?: string;
}

const defaultCenter: Location = {
  lat: 25.6866, // Monterrey, México
  lng: -100.3161
};

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

function GoogleMapInner({
  onLocationSelect,
  initialCenter = defaultCenter,
  selectedLocation,
  height = '400px',
  width = '100%'
}: GoogleMapProps) {
  const [marker, setMarker] = useState<Location | null>(selectedLocation || null);
  const { isLoaded, loadError } = useGoogleMaps();

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newLocation: Location = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      
      setMarker(newLocation);
      onLocationSelect?.(newLocation);
    }
  }, [onLocationSelect]);

  const handleMarkerClick = useCallback(() => {
    // Opcional: mostrar información del marker
    console.log('Marker clicked:', marker);
  }, [marker]);

  if (loadError) {
    return (
      <div className="w-full h-96 bg-red-100 rounded-lg flex items-center justify-center">
        <p className="text-red-600">Error al cargar Google Maps: {loadError.message}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-600">Cargando mapa...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <GoogleMap
        mapContainerStyle={{ ...mapContainerStyle, height, width }}
        center={selectedLocation || initialCenter}
        zoom={12}
        onClick={handleMapClick}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
        }}
      >
        {marker && (
          <Marker
            position={marker}
            onClick={handleMarkerClick}
            animation={google.maps.Animation.DROP}
          />
        )}
      </GoogleMap>
      
      {marker && (
        <div className="mt-4 p-3 bg-brand-beige rounded-lg border border-brand-black">
          <p className="text-sm text-brand-black">
            <strong>Ubicación seleccionada:</strong>
          </p>
          <p className="text-xs text-brand-black">
            Lat: {marker.lat.toFixed(6)}, Lng: {marker.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
}

export default function GoogleMapComponent(props: GoogleMapProps) {
  return (
    <GoogleMapsProvider>
      <GoogleMapInner {...props} />
    </GoogleMapsProvider>
  );
}
