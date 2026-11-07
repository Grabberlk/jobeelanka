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
  ],
  authors: [{ name: "JobeeLanka" }],
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
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JobeeLanka — Sri Lanka Job Directory",
    description: "Verified jobs, employer career pages, and direct recruiter contacts.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

