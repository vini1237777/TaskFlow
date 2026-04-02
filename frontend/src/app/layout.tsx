import type { Metadata } from 'next';
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'TaskFlow — Manage What Matters',
  description: 'A beautifully minimal task management system.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} font-body bg-layer text-ink antialiased`}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#0e0e11',
              border: '1px solid #e0e0e8',
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.875rem',
              borderRadius: '10px',
            },
            success: {
              iconTheme: { primary: '#10d98a', secondary: '#1c1c22' },
            },
            error: {
              iconTheme: { primary: '#f56060', secondary: '#1c1c22' },
            },
          }}
        />
      </body>
    </html>
  );
}
