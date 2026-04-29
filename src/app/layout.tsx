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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Belajarpedia — Direktori Sekolah, Universitas, dan Kursus di Indonesia",
    template: "%s | Belajarpedia",
  },
  description:
    "Belajarpedia membantu Anda menemukan sekolah, universitas, dan kursus di seluruh Indonesia. Bandingkan biaya, kurikulum, dan lokasi dengan mudah.",
  applicationName: "Belajarpedia",
  authors: [{ name: "Timedoor" }],
  creator: "Timedoor",
  publisher: "Belajarpedia",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
