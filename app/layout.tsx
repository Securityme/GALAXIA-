import type { Metadata, Viewport } from 'next';
import './globals.css'; // Global styles

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#050711',
};

export const metadata: Metadata = {
  title: 'GALAXIA',
  description: 'Jeu de stratégie 4X, d\'exploration et de survie spatiale avec architecture Dual-Window, Maître de Jeu procédural et persistance galactique.',
  openGraph: {
    title: 'GALAXIA',
    description: 'Jeu de stratégie 4X, d\'exploration et de survie spatiale avec architecture Dual-Window, Maître de Jeu procédural et persistance galactique.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GALAXIA',
    description: 'Jeu de stratégie 4X, d\'exploration et de survie spatiale avec architecture Dual-Window, Maître de Jeu procédural et persistance galactique.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fr">
      <body suppressHydrationWarning className="antialiased min-h-screen selection:bg-purple-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
