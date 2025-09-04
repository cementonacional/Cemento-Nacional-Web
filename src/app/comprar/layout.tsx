import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Comprar - Cemento Nacional',
  description: 'Compra nuestro cemento CPC30 de 25kg con envío directo a tu domicilio.',
  keywords: 'comprar, cemento, CPC30, 25kg, envío, stripe',
};

export default function ComprarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
