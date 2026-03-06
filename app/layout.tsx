import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.sanjaykrishnanjv.com'),
  title: {
    default: 'Sanjay Krishnan JV - Senior System Engineer | Azure & Cloud Infrastructure Specialist',
    template: '%s | Sanjay Krishnan JV'
  },
  description: 'Senior System Engineer at WellSky specializing in Azure, AVD, Nerdio, and cloud infrastructure. ITIL V4 certified with expertise in PowerShell automation and virtual desktop solutions.',
  keywords: [
    'Sanjay Krishnan JV',
    'Senior System Engineer',
    'Azure Specialist',
    'AVD Expert',
    'Nerdio',
    'PowerShell',
    'ITIL V4',
    'Cloud Infrastructure',
    'VDI',
    'Active Directory',
    'Windows 365',
    'WellSky'
  ],
  authors: [{ name: 'Sanjay Krishnan JV', url: 'https://www.sanjaykrishnanjv.com' }],
  creator: 'Sanjay Krishnan JV',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.sanjaykrishnanjv.com',
    title: 'Sanjay Krishnan JV - Senior System Engineer',
    description: 'Senior System Engineer at WellSky | ITIL V4 Certified | Azure, AVD, Nerdio Expert',
    siteName: 'Sanjay Krishnan JV Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sanjay Krishnan JV - Senior System Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sanjay Krishnan JV - Senior System Engineer',
    description: 'Azure & Cloud Infrastructure Specialist | ITIL V4 Certified | PowerShell Expert',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Sanjay Krishnan JV',
    jobTitle: 'Senior System Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'WellSky'
    },
    url: 'https://www.sanjaykrishnanjv.com',
    sameAs: [
      'https://github.com/SanjayKrishnanJV',
      'https://in.linkedin.com/in/sanjaykrishnanjv',
      'https://orcid.org/0009-0008-8486-2404'
    ],
    knowsAbout: [
      'Microsoft Azure',
      'Azure Virtual Desktop',
      'Nerdio',
      'PowerShell',
      'ITIL',
      'Cloud Infrastructure',
      'Virtual Desktop Infrastructure',
      'Active Directory'
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bengaluru',
      addressRegion: 'Karnataka',
      addressCountry: 'IN'
    }
  };

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const shouldBeDark = theme === 'dark' || (!theme && prefersDark);
                if (shouldBeDark) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={cn(inter.className, 'antialiased')} suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
