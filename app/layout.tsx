// app/layout.tsx
import type { Metadata } from "next";
import { Dancing_Script, Geist } from "next/font/google";
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
import { OrganizationStructuredData, WebsiteStructuredData, LocalBusinessStructuredData } from "@/lib/structured-data";
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
  display: "swap",
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
          {/* SEO Meta Tags */}
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#f4b7c7" />
          <meta name="msapplication-TileColor" content="#f4b7c7" />
          <meta name="application-name" content="Favee" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Favee" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="msapplication-tap-highlight" content="no" />
          
          {/* Business Information */}
          <meta name="geo.region" content="IN" />
          <meta name="geo.country" content="India" />
          <meta name="language" content="English" />
          <meta name="distribution" content="global" />
          <meta name="rating" content="general" />
          <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
          
          {/* Social Media Meta Tags */}
          <meta property="fb:app_id" content="YOUR_FACEBOOK_APP_ID" />
          <meta name="twitter:site" content="@favee" />
          <meta name="twitter:creator" content="@favee" />
          
          {/* Structured Data */}
          <OrganizationStructuredData />
          <WebsiteStructuredData />
          <LocalBusinessStructuredData />
          
          {/* External Scripts */}
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
              gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: document.title,
                page_location: window.location.href,
                custom_map: {
                  'dimension1': 'user_type',
                  'dimension2': 'product_category'
                }
              });
            `}
          </Script>
          
          {/* Google Search Console */}
          <meta name="google-site-verification" content="YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE" />
          
          {/* Microsoft Clarity */}
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "YOUR_CLARITY_ID");
            `}
          </Script>
          
          {/* Facebook Pixel */}
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'YOUR_FACEBOOK_PIXEL_ID');
              fbq('track', 'PageView');
            `}
          </Script>
        </head>
        <body
          className={`${geistSans.variable} ${dancingScript.variable} antialiased ${playfair.variable}`}
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
