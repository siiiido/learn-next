import '@/app/ui/global.css';
import { inter } from './ui/fonts';
import { Metadata } from 'next';

/**
 * Metadata in nested pages will override the metadata in the parent.
 */
export const metadata: Metadata = {
  title: {
    /* The %s in the template will be replaced with the specific page title. */
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* 
        antialiased
      Here, you're also adding the Tailwind antialiased class which smooths out
      the font. It's not necessary to use this class, but it adds a nice touch. */}
      <body className={`${inter.className}  antialiased`}>{children}</body>
    </html>
  );
}
