// app/layout.tsx
import type { Metadata } from "next";
import { Dancing_Script, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/component/Header";
import Providers from "@/app/provider"; // 👈 import the wrapper
import { Playfair_Display } from "next/font/google";
import Footer from "@/component/Footer";
import { Toaster } from "react-hot-toast";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Script from "next/script";
import { generateMetadata as generateSEOMetadata, defaultSEO } from "@/lib/seo";
import { OrganizationStructuredData, WebsiteStructuredData } from "@/lib/structured-data";
import PerformanceMonitor from "@/component/PerformanceMonitor";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = generateSEOMetadata(defaultSEO);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <OrganizationStructuredData />
          <WebsiteStructuredData />
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="lazyOnload"
          />
          {/* Google Analytics */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID');
            `}
          </Script>
          {/* Google Search Console */}
          <meta name="google-site-verification" content="YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} antialiased  ${playfair.variable}`}
        >
          <Providers>
            {" "}
            {/* ✅ Redux store provided to your whole app */}
            <PerformanceMonitor />
            <Header />
            <Toaster position="top-center" />
            {children}
            <Footer />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  ); 
}
