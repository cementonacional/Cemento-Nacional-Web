import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Sobre Nosotros - Cemento Nacional',
  description: 'Conoce la historia y valores de Cemento Nacional, la fuerza del presente.',
  keywords: 'cemento, historia, valores, empresa, México',
};

export default function SobrePage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-brand-black mb-6">
          Sobre Cemento Nacional
        </h1>
        <p className="text-xl text-brand-black font-roc-grotesc font-thin">
          La Fuerza del Presente
        </p>
      </div>

      {/* Historia */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-brand-black mb-6">
              Nuestra Historia
            </h2>
            <p className="text-lg text-brand-black mb-4">
              Cemento Nacional nació de la visión de proporcionar materiales de construcción 
              de la más alta calidad para el desarrollo de México. Desde nuestros inicios, 
              hemos estado comprometidos con la excelencia y la innovación.
            </p>
            <p className="text-lg text-brand-black">
              Nuestro cemento Portland Gris CPC30 es el resultado de años de investigación 
              y desarrollo, garantizando la resistencia y durabilidad que nuestros clientes 
              merecen.
            </p>
          </div>
          <div className="relative h-64 bg-brand-beige rounded-lg flex items-center justify-center">
            <div className="text-brand-black text-lg font-medium">
              Imagen de Historia
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-brand-black mb-8 text-center">
          Nuestros Valores
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">✓</span>
            </div>
            <h3 className="text-xl font-bold text-brand-black mb-2">Calidad</h3>
            <p className="text-brand-black">
              Garantizamos la más alta calidad en todos nuestros productos.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">⚡</span>
            </div>
            <h3 className="text-xl font-bold text-brand-black mb-2">Innovación</h3>
            <p className="text-brand-black">
              Constantemente innovamos para mejorar nuestros procesos y productos.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">🤝</span>
            </div>
            <h3 className="text-xl font-bold text-brand-black mb-2">Confianza</h3>
            <p className="text-brand-black">
              Construimos relaciones duraderas basadas en la confianza y el respeto.
            </p>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-brand-beige p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-brand-black mb-4">Nuestra Misión</h3>
          <p className="text-brand-black">
            Proporcionar materiales de construcción de la más alta calidad, 
            contribuyendo al desarrollo y progreso de México a través de 
            productos confiables y duraderos.
          </p>
        </div>
        <div className="bg-brand-beige p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-brand-black mb-4">Nuestra Visión</h3>
          <p className="text-brand-black">
            Ser reconocidos como la empresa líder en la producción de cemento 
            de alta calidad, siendo el pilar fundamental en la construcción 
            del futuro de México.
          </p>
        </div>
      </section>
    </div>
  );
}
