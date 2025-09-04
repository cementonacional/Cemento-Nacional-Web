'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/calidad', label: 'Calidad' },
  { href: '/galeria', label: 'Galería' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/comprar', label: 'Comprar' },
  { href: '/pedidos', label: 'Pedidos' },
];

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex justify-center">
      {/* Contenedor principal con borde negro y sombra solo en abajo y derecha */}
      <div className="bg-brand-red px-16 py-8 rounded-lg border-2 border-brand-black shadow-[8px_8px_0_0_rgba(28,28,28,0.8)] relative">
        {/* Contenido de navegación */}
        <nav 
          className="relative z-10 flex items-center justify-center"
          role="navigation"
          aria-label="Navegación principal"
        >
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-10" role="menubar">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-brand-black hover:text-white transition-colors font-roc-grotesc font-bold text-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-red rounded ${
                  pathname === link.href ? 'text-white' : ''
                }`}
                role="menuitem"
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-brand-black hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-red rounded"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div 
            id="mobile-menu"
            className="absolute top-full left-0 right-0 bg-brand-red rounded-b-lg border-2 border-t-0 border-brand-black shadow-[8px_8px_0_0_rgba(28,28,28,0.8)] md:hidden z-50 mt-2"
            role="menu"
            aria-label="Menú móvil"
          >
            <div className="px-16 py-8">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-brand-black hover:text-white transition-colors font-roc-grotesc font-bold text-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-red rounded ${
                      pathname === link.href ? 'text-white' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    role="menuitem"
                    aria-current={pathname === link.href ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
