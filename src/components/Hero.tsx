import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <div className="text-center py-16 relative">
      {/* Logo textual con efecto de costal */}
      <div className="mb-8">
        <h1 className="text-5xl md:text-7xl font-bold text-brand-black mb-4 drop-shadow-lg">
          CEMENTO
        </h1>
        <h1 className="text-5xl md:text-7xl font-bold text-brand-black mb-4 drop-shadow-lg">
          NACIONAL
        </h1>
        <div className="text-brand-red text-sm font-bold mt-2">®</div>
      </div>

      {/* Slogan con estilo del costal */}
      <p className="text-xl md:text-2xl text-brand-black mb-8 font-thin drop-shadow-sm font-roc-grotesc">
        LA FUERZA DEL PRESENTE
      </p>
    </div>
  );
}
