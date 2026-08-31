import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ficha Médica | Sistema de Gestión Clínica',
  description: 'Aplicación para ingreso, validación y administración de fichas médicas con persistencia local y pruebas de software.',
  keywords: ['ficha médica', 'testing', 'calidad de software', 'next.js', 'react', 'typescript'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col antialiased bg-slate-50 text-slate-900 selection:bg-medical-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
