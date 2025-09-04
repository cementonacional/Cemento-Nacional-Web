import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pedidos - Cemento Nacional',
  description: 'Realiza pedidos de cemento con cálculo de flete y envío a domicilio.',
  keywords: 'pedidos, cemento, flete, envío, domicilio, cálculo',
};

export default function PedidosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
