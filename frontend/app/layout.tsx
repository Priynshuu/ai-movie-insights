import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Movie Insights',
  description: 'Get comprehensive movie information and AI-powered sentiment analysis',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-dark-bg text-dark-text min-h-screen">{children}</body>
    </html>
  );
}
