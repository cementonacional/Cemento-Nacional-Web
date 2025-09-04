'use client';

import { useState, useCallback } from 'react';

interface Location {
  lat: number;
  lng: number;
}

interface GeocodingResult {
  location: Location;
  formattedAddress: string;
}

export function useGeocoding() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocodeAddress = useCallback(async (address: string): Promise<GeocodingResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        throw new Error('Google Maps API key no configurada');
      }

      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error(`Error de geocodificación: ${data.status}`);
      }

      if (!data.results || data.results.length === 0) {
        throw new Error('No se encontró la dirección');
      }

      const result = data.results[0];
      const location = result.geometry.location;

      return {
        location: {
          lat: location.lat,
          lng: location.lng
        },
        formattedAddress: result.formatted_address
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reverseGeocode = useCallback(async (location: Location): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        throw new Error('Google Maps API key no configurada');
      }

      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error(`Error de geocodificación inversa: ${data.status}`);
      }

      if (!data.results || data.results.length === 0) {
        throw new Error('No se encontró la dirección para estas coordenadas');
      }

      return data.results[0].formatted_address;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    geocodeAddress,
    reverseGeocode,
    isLoading,
    error,
    clearError: () => setError(null)
  };
}
