import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import {AuthProvider} from '@/lib/auth-context';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'PhotoMeh - Auto Insurance Damage Estimator',
  description:
    'AI-powered car damage detection and repair cost estimation for insurance companies',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
