'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import NavBar from './NavBar';

interface BagFrameProps {
  children: React.ReactNode;
}

export default function BagFrame({ children }: BagFrameProps) {
  const pathname = usePathname();
  
  // Páginas donde debe aparecer el cuadro rojo
  const showRedBox = pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Only navigation bar, no full-width red background */}
      <header className="w-full py-6 relative">
        {/* Contenido centrado */}
        <div className="relative z-10 max-w-bag mx-auto px-4">
          <NavBar />
        </div>
      </header>

      {/* Main content - Beige background with subtle texture */}
      <main className="flex-1 bg-brand-beige relative">
        {/* Efecto de textura sutil */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
        
        {/* Contenido principal */}
        <div className="relative z-10 max-w-bag mx-auto px-4 py-8">
          {children}
        </div>
      </main>

      {/* Footer - Black base */}
      <footer className="w-full bg-brand-black py-24 relative">
        {/* Sombra de la base del costal */}
        <div className="absolute inset-0 bg-brand-black shadow-[0_-8px_0_0_rgba(28,28,28,0.7)]"></div>
      </footer>

      {/* Cuadro rojo que atraviesa el contenido y el footer - solo en Inicio */}
      {showRedBox && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-20">
          <div className="w-[600px] h-96 bg-brand-red border-2 border-brand-black shadow-[4px_4px_0_0_rgba(28,28,28,0.8)] rounded-lg">
            {/* Contenido del cuadro rojo */}
            <div className="p-12 text-center">
              <div className="text-brand-black text-4xl font-bold mb-6">
                PORTLAND
              </div>
              <div className="text-brand-black text-4xl font-bold mb-6">
                GRIS CPC30
              </div>
              <div className="text-brand-black text-2xl font-bold">
                CONT. NET. 25kg
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
