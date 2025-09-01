// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/component/Header";
import Providers from "@/app/provider"; // 👈 import the wrapper
import { Playfair_Display } from 'next/font/google';
import Footer from "@/component/Footer"
import { Toaster } from 'react-hot-toast'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elegance Boutique - Premium Sarees & Lehengas",
  description: "Discover the finest collection of traditional Indian sarees and lehengas. Elegance Boutique brings you premium ethnic wear for every occasion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  ${playfair.variable}`}
       
      >
        <Providers> {/* ✅ Redux store provided to your whole app */}
          <Header />
          <Toaster position="top-center" />
                    
          {children}
          <Footer/>
        </Providers>
      </body>
    </html>
    </ClerkProvider>
  );
}
