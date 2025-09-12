import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://freelunch.dev"),
  title: "Freelunch - DevOps | MLOps Platform",
  description: "Everything you need to help your startup reach Google-level maturity in one unified platform. All-in-one open-source backend platform for DevOps, DataOps, MLOps, LLMOps.",
  keywords: "AI, artificial intelligence, productivity, automation, technology, DevOps, DataOps, MLOps, LLMOps, backend platform",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
      },
    ],
  },
  openGraph: {
    title: "Freelunch - DevOps | MLOps Platform",
    description: "Everything you need to help your startup reach Google-level maturity in one unified platform.",
    url: "https://freelunch.dev",
    siteName: "Freelunch",
    images: [
      {
        url: "/logo_freelunch.svg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Freelunch - DevOps | MLOps Platform",
    description: "Everything you need to help your startup reach Google-level maturity in one unified platform.",
    images: ["/logo_freelunch.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="preload" 
          href="/fonts/CarterOne-Regular.ttf" 
          as="font" 
          type="font/ttf" 
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
