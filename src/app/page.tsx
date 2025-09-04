import React from 'react';
import Hero from '@/components/Hero';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <Hero />

      {/* Información adicional del producto */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-brand-beige p-6 rounded-lg border-2 border-brand-black text-center">
          <h3 className="text-xl font-bold text-brand-black mb-3">
            Calidad Garantizada
          </h3>
          <p className="text-brand-black">
            Cumple con la norma NMX-C-414-ONNCCE
          </p>
        </div>
        
        <div className="bg-brand-beige p-6 rounded-lg border-2 border-brand-black text-center">
          <h3 className="text-xl font-bold text-brand-black mb-3">
            Envío Nacional
          </h3>
          <p className="text-brand-black">
            Disponible en toda la República Mexicana
          </p>
        </div>
        
        <div className="bg-brand-beige p-6 rounded-lg border-2 border-brand-black text-center">
          <h3 className="text-xl font-bold text-brand-black mb-3">
            Soporte Técnico
          </h3>
          <p className="text-brand-black">
            Asesoría especializada en construcción
          </p>
        </div>
      </div>
    </div>
  );
}
