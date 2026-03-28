import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'alkindyTech - Crafting Modern Websites That Inspire',
  description: 'Professional freelance web developer and frontend engineer specializing in React, Next.js, and modern web technologies. Building exceptional digital experiences for businesses and organizations.',
  keywords: ['web developer', 'frontend developer', 'React', 'Next.js', 'TypeScript', 'freelance', 'web design', 'Tanzania'],
  authors: [{ name: 'Ally M. Said', url: 'https://alkindytech.com' }],
  creator: 'Ally M. Said',
  publisher: 'alkindyTech',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://alkindytech.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/assets/alkindy.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/alkindy.png', sizes: '16x16', type: 'image/png' },
      { url: '/assets/alkindy.png', sizes: '48x48', type: 'image/png' }, 
    ],
    apple: [
      { url: '/assets/alkindy.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'alkindyTech - Crafting Modern Websites That Inspire',
    description: 'Professional freelance web developer and frontend engineer specializing in React, Next.js, and modern web technologies.',
    url: 'https://alkindytech.com',
    siteName: 'alkindyTech',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'alkindyTech - Professional Web Developer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'alkindyTech - Crafting Modern Websites That Inspire',
    description: 'Professional freelance web developer and frontend engineer specializing in React, Next.js, and modern web technologies.',
    images: ['/og-image.jpg'],
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
