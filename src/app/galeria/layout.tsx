import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Galería - Cemento Nacional',
  description: 'Explora nuestra galería de imágenes de productos, instalaciones y proyectos.',
  keywords: 'galería, imágenes, productos, instalaciones, cemento nacional',
};

export default function GaleriaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
