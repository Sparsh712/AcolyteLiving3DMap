import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Student Housing Explorer',
  description:
    'Fly through World in 3D and discover student accommodations. Interactive map powered by MapLibre GL JS.',
  keywords: ['student accommodation', 'housing', '3D map', 'university'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
