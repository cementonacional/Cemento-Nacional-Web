import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto - Cemento Nacional',
  description: 'Contáctanos para obtener información sobre nuestros productos y servicios.',
  keywords: 'contacto, información, productos, servicios, cemento nacional',
};

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
