import React from 'react';
import Hero from '@/components/Hero';
import StripeBuyButton from '@/components/StripeBuyButton';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <Hero />
      
      {/* Sección de Compra Directa */}
      <div className="text-center">
        <div className="bg-brand-beige p-8 rounded-lg border-2 border-brand-black max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-black mb-4">
            Compra Directa
          </h2>
          <p className="text-lg text-brand-black mb-6">
            Cemento Portland Gris CPC30 - 25kg
          </p>
          
          {/* Stripe Buy Button */}
          <div className="flex justify-center">
            <StripeBuyButton
              buyButtonId="buy_btn_1S3THEDsNXfLCcFrs4o635kK"
              publishableKey="pk_test_51S3T09DsNXfLCcFrsfaCHMzA2m3JjdRcWpy0PWpgfug7M1UwLvxS3EExtimLw8bniNDQNZlh7T1La0OhAMGjPTWy00EFlYlOzX"
            />
          </div>
          
          <p className="text-sm text-brand-black mt-4">
            🔒 Pago seguro procesado por Stripe
          </p>
        </div>
      </div>

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
