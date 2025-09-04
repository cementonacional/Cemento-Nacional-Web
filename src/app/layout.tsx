import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import BagFrame from "@/components/BagFrame";
import NavBar from "@/components/NavBar";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Cemento Nacional - La Fuerza del Presente",
    template: "%s | Cemento Nacional"
  },
  description: "Cemento de alta calidad para construcción. CPC30 25kg disponible para compra y pedidos a domicilio. Envío nacional con cálculo de flete automático.",
  keywords: "cemento, construcción, CPC30, México, pedidos, flete, cemento nacional, construcción mexicana, cemento portland",
  authors: [{ name: "Cemento Nacional" }],
  creator: "Cemento Nacional",
  publisher: "Cemento Nacional",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: '/',
    title: 'Cemento Nacional - La Fuerza del Presente',
    description: 'Cemento de alta calidad para construcción. CPC30 25kg disponible para compra y pedidos a domicilio.',
    siteName: 'Cemento Nacional',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cemento Nacional - La Fuerza del Presente',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cemento Nacional - La Fuerza del Presente',
    description: 'Cemento de alta calidad para construcción. CPC30 25kg disponible para compra y pedidos a domicilio.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${montserrat.variable} ${inter.variable} antialiased`}
      >
        {/* Skip link para accesibilidad */}
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        
        <BagFrame>
          <main id="main-content">
            {children}
          </main>
        </BagFrame>
      </body>
    </html>
  );
}
