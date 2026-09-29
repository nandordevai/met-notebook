import type { Metadata } from 'next';
import { Fraunces } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
  title: 'MET Research Notebook',
  description: 'A Visual Research Notebook for Art and Cultural Studies',
};

const fraunces = Fraunces({
  subsets: ['latin'],
});

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={fraunces.className}>
      <body>{children}</body>
    </html>
  );
}
