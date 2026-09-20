import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ThemeProvider } from "@/components/sections/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const SITE_URL = "https://alkindytech.com";
const SITE_TITLE = "alkindyTech — Web Developer & Software Solutions";
const SITE_DESCRIPTION =
  "alkindyTech is the studio of Ally M. Said, a web developer building custom websites and software solutions with React, Next.js, and TypeScript for businesses that want to win online.";

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: "%s | alkindyTech",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "web developer",
    "software solutions",
    "custom web development",
    "React developer",
    "Next.js developer",
    "TypeScript",
    "business website design",
    "web application development",
    "alkindyTech",
    "Tanzania web developer",
    "Dar es Salaam web developer",
  ],
  authors: [{ name: "Ally M. Said", url: SITE_URL }],
  creator: "Ally M. Said",
  publisher: "alkindyTech",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/assets/alkindy.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/alkindy.png", sizes: "16x16", type: "image/png" },
      { url: "/assets/alkindy.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: "/assets/alkindy.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "alkindyTech",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#business`,
  name: "alkindyTech",
  url: SITE_URL,
  image: `${SITE_URL}/assets/alkindy.png`,
  description: SITE_DESCRIPTION,
  founder: {
    "@type": "Person",
    name: "Ally M. Said",
    jobTitle: "Web Developer",
    url: SITE_URL,
    sameAs: [
      "https://github.com/allyalkindy",
      "https://www.linkedin.com/in/ally-mohammed-96a31a319",
    ],
  },
  areaServed: "Worldwide",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dar es Salaam",
    addressCountry: "TZ",
  },
  email: "allymohammedsaid126@gmail.com",
  sameAs: [
    "https://github.com/allyalkindy",
    "https://www.linkedin.com/in/ally-mohammed-96a31a319",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable}`}
    >
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <GoogleAnalytics gaId="G-PZE529NJB8" />

        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
