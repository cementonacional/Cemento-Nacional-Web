'use client';

import { useState } from 'react';

// Datos de ejemplo para la galería
const galleryImages = [
  {
    id: 1,
    title: 'Costal CPC30',
    description: 'Nuestro producto estrella CPC30 de 25kg',
    placeholder: 'Imagen del Costal CPC30'
  },
  {
    id: 2,
    title: 'Planta de Producción',
    description: 'Instalaciones modernas de fabricación',
    placeholder: 'Imagen de la Planta'
  },
  {
    id: 3,
    title: 'Control de Calidad',
    description: 'Laboratorio de análisis y certificación',
    placeholder: 'Imagen del Laboratorio'
  },
  {
    id: 4,
    title: 'Proyecto Residencial',
    description: 'Construcción con Cemento Nacional',
    placeholder: 'Imagen de Proyecto'
  },
  {
    id: 5,
    title: 'Infraestructura',
    description: 'Puentes y carreteras construidos con nuestro cemento',
    placeholder: 'Imagen de Infraestructura'
  },
  {
    id: 6,
    title: 'Equipo de Trabajo',
    description: 'Profesionales comprometidos con la calidad',
    placeholder: 'Imagen del Equipo'
  },
  {
    id: 7,
    title: 'Certificaciones',
    description: 'Normas y estándares de calidad',
    placeholder: 'Imagen de Certificaciones'
  },
  {
    id: 8,
    title: 'Distribución',
    description: 'Red de distribución nacional',
    placeholder: 'Imagen de Distribución'
  }
];

export default function GaleriaPage() {
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

  const openLightbox = (image: typeof galleryImages[0]) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-brand-black mb-8 text-center">
        Galería de Imágenes
      </h1>
      
      {/* Grid de imágenes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleryImages.map((image) => (
          <div
            key={image.id}
            className="aspect-square bg-brand-gold rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => openLightbox(image)}
          >
            <div className="h-full flex items-center justify-center p-4">
              <div className="text-center">
                <p className="text-white text-sm font-semibold mb-2">
                  {image.title}
                </p>
                <p className="text-white text-xs opacity-80">
                  {image.placeholder}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      
      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeLightbox}
        >
          <div 
            className="bg-white rounded-lg max-w-2xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-brand-black">
                {selectedImage.title}
              </h3>
              <button
                onClick={closeLightbox}
                className="text-brand-black hover:text-brand-red text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="bg-brand-gold rounded-lg p-8 mb-4 flex items-center justify-center">
              <p className="text-white text-lg font-semibold">
                {selectedImage.placeholder}
              </p>
            </div>
            
            <p className="text-brand-black text-sm">
              {selectedImage.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
