// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import SessionProvider from '@/components/SessionProvider';

export const metadata: Metadata = {
  title: 'LeadGen AI - AI-Powered Lead Generation & Website Auditing',
  description: 'Automatically discover leads, audit websites, and generate personalized outreach emails with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}