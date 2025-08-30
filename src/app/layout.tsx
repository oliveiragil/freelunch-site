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
  title: "FreeLunch - AI Intelligence Platform",
  description: "Revolutionize your workflow with cutting-edge AI technology that learns, adapts, and delivers unprecedented results. Join the waitlist for early access.",
  keywords: "AI, artificial intelligence, productivity, automation, technology",
  openGraph: {
    title: "FreeLunch - AI Intelligence Platform",
    description: "Revolutionize your workflow with cutting-edge AI technology that learns, adapts, and delivers unprecedented results.",
    url: "https://freelunch.dev",
    siteName: "FreeLunch",
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
    title: "FreeLunch - AI Intelligence Platform",
    description: "Revolutionize your workflow with cutting-edge AI technology that learns, adapts, and delivers unprecedented results.",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
