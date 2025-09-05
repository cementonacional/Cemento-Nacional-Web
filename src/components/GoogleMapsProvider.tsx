'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { LoadScript } from '@react-google-maps/api';

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | undefined;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: undefined,
});

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error('useGoogleMaps must be used within GoogleMapsProvider');
  }
  return context;
};

interface GoogleMapsProviderProps {
  children: React.ReactNode;
}

export default function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | undefined>(undefined);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-600">Google Maps API key no configurada</p>
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      preventGoogleFontsLoading
      onLoad={() => setIsLoaded(true)}
      onError={(error) => setLoadError(error)}
    >
      <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
        {children}
      </GoogleMapsContext.Provider>
    </LoadScript>
  );
}
