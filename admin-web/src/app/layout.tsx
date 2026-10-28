import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LGU Admin Control Panel | Lahore Garrison University',
  description: 'Enterprise Administrative Web Portal for Lahore Garrison University Ecosystem',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
