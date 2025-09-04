import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calidad - Cemento Nacional',
  description: 'Descubre la fórmula y especificaciones técnicas de nuestro cemento CPC30 de alta calidad.',
  keywords: 'calidad, fórmula, especificaciones, CPC30, cemento nacional',
};

const formulaComponents = [
  {
    name: 'Clinker',
    percentage: '65%',
    description: 'Componente principal obtenido de la calcinación de caliza y arcilla'
  },
  {
    name: 'Puzolana',
    percentage: '25%',
    description: 'Material volcánico que mejora la resistencia y durabilidad'
  },
  {
    name: 'Yeso',
    percentage: '5%',
    description: 'Regulador del tiempo de fraguado del cemento'
  },
  {
    name: 'Aditivos',
    percentage: '5%',
    description: 'Mejoradores de propiedades específicas del cemento'
  }
];

const specifications = [
  {
    title: 'Resistencia a Compresión',
    value: '30 MPa',
    description: 'Resistencia mínima a los 28 días'
  },
  {
    title: 'Tiempo de Fraguado',
    value: '45-375 min',
    description: 'Tiempo inicial y final de fraguado'
  },
  {
    title: 'Expansión',
    value: '≤ 10 mm',
    description: 'Expansión máxima en autoclave'
  },
  {
    title: 'Finenza',
    value: '≥ 280 m²/kg',
    description: 'Superficie específica mínima'
  }
];

export default function CalidadPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-brand-black mb-8 text-center">
        Calidad Garantizada
      </h1>
      
      {/* Fórmula del Cemento */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-brand-black mb-6 text-center">
          Fórmula del Cemento CPC30
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {formulaComponents.map((component, index) => (
            <div 
              key={index}
              className="border-2 border-brand-gold rounded-lg p-6 bg-white shadow-lg"
            >
              <div className="text-center">
                <h3 className="text-xl font-bold text-brand-black mb-2">
                  {component.name}
                </h3>
                <div className="text-3xl font-bold text-brand-gold mb-3">
                  {component.percentage}
                </div>
                <p className="text-sm text-brand-black leading-relaxed">
                  {component.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Especificaciones Técnicas */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-brand-black mb-6 text-center">
          Especificaciones Técnicas
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {specifications.map((spec, index) => (
            <div 
              key={index}
              className="border-2 border-brand-gold rounded-lg p-6 bg-white shadow-lg"
            >
              <h3 className="text-xl font-bold text-brand-black mb-2">
                {spec.title}
              </h3>
              <div className="text-2xl font-bold text-brand-gold mb-3">
                {spec.value}
              </div>
              <p className="text-sm text-brand-black">
                {spec.description}
              </p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Certificaciones */}
      <section>
        <h2 className="text-3xl font-bold text-brand-black mb-6 text-center">
          Certificaciones y Normas
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border-2 border-brand-gold rounded-lg p-6 bg-white shadow-lg text-center">
            <h3 className="text-xl font-bold text-brand-black mb-3">
              NMX-C-414-ONNCCE
            </h3>
            <p className="text-sm text-brand-black">
              Norma Mexicana que especifica los requisitos para cementos hidráulicos
            </p>
          </div>
          <div className="border-2 border-brand-gold rounded-lg p-6 bg-white shadow-lg text-center">
            <h3 className="text-xl font-bold text-brand-black mb-3">
              ISO 9001:2015
            </h3>
            <p className="text-sm text-brand-black">
              Sistema de Gestión de Calidad certificado internacionalmente
            </p>
          </div>
          <div className="border-2 border-brand-gold rounded-lg p-6 bg-white shadow-lg text-center">
            <h3 className="text-xl font-bold text-brand-black mb-3">
              ISO 14001:2015
            </h3>
            <p className="text-sm text-brand-black">
              Sistema de Gestión Ambiental para operaciones sostenibles
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
