'use client';

import React, { useEffect } from 'react';

interface StripeBuyButtonProps {
  buyButtonId: string;
  publishableKey: string;
}

export default function StripeBuyButton({ buyButtonId, publishableKey }: StripeBuyButtonProps) {
  useEffect(() => {
    // Cargar el script de Stripe si no está cargado
    if (!document.querySelector('script[src="https://js.stripe.com/v3/buy-button.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/buy-button.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
          <stripe-buy-button
            buy-button-id="${buyButtonId}"
            publishable-key="${publishableKey}"
          >
          </stripe-buy-button>
        `
      }}
    />
  );
}
