import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - Cemento Nacional',
  description: 'Panel de administración para gestionar mensajes, órdenes y configuraciones.',
  keywords: 'admin, administración, panel, gestión, cemento nacional',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
