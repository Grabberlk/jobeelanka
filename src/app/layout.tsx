import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "JobeeLanka | Sri Lanka's Trusted Jobs & Career Directory",
  description:
    "Discover verified career opportunities in Sri Lanka. Tech, banking, apparel, and overseas jobs. Instant direct apply and official WhatsApp contact with verified employers.",
  keywords: [
    "Jobs in Sri Lanka",
    "JobeeLanka",
    "Colombo tech jobs",
    "Software Engineer salary Sri Lanka",
    "SLBFE overseas jobs",
    "Government vacancies Sri Lanka",
    "Remote jobs Sri Lanka",
    "Sri Lanka careers",
    "IT jobs Colombo",
  ],
  authors: [{ name: "JobeeLanka", url: "https://www.jobeelanka.com" }],
  creator: "JobeeLanka",
  publisher: "JobeeLanka",
  metadataBase: new URL("https://www.jobeelanka.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "JobeeLanka | Find Jobs. Find Employers. Find Opportunities.",
    description:
      "Sri Lanka’s trusted job directory. Browse verified vacancies, company career pages, and direct WhatsApp recruiter lines.",
    url: "https://www.jobeelanka.com",
    siteName: "JobeeLanka",
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JobeeLanka — Sri Lanka Job Directory",
    description: "Verified jobs, employer career pages, and direct recruiter contacts.",
  },
  other: {
    "geo.region": "LK",
    "geo.placename": "Colombo, Western Province, Sri Lanka",
    "geo.position": "6.9271;79.8612",
    "ICBM": "6.9271, 79.8612",
    "dc.coverage": "Sri Lanka",
    "rating": "general",
  },
};

const jsonLdOrg = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "JobeeLanka",
  "url": "https://www.jobeelanka.com",
  "logo": "https://www.jobeelanka.com/favicon.ico",
  "sameAs": [
    "https://twitter.com/jobeelanka",
    "https://facebook.com/jobeelanka",
    "https://linkedin.com/company/jobeelanka"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Colombo",
    "addressRegion": "Western Province",
    "addressCountry": "LK"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["English", "Sinhala", "Tamil"]
  }
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "JobeeLanka",
  "url": "https://www.jobeelanka.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.jobeelanka.com/jobs?query={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('jobeelanka-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body className="font-sans antialiased flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
