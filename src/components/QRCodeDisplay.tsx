'use client';

import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  data: string | Record<string, unknown>;
  size?: number;
  className?: string;
}

export default function QRCodeDisplay({ data, size = 200, className = '' }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && data) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Generar QR Code
        QRCode.toCanvas(canvas, JSON.stringify(data), {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        }).catch((error) => {
          console.error('Error generating QR code:', error);
        });
      }
    }
  }, [data, size]);

  return (
    <div className={`text-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="border border-gray-300 rounded-lg"
      />
      <p className="text-xs text-gray-600 mt-2">
        Escanea para ver detalles
      </p>
    </div>
  );
}
