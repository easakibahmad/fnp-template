import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FNP Template",
    template: "%s - FNP Template",
  },
  description: "Starter template for full-stack applications with FastAPI, Next.js, and PostgreSQL.",
  applicationName: "FNP Template",
  keywords: [
    "fastapi",
    "next.js",
    "postgres",
    "template",
  ],
  authors: [{ name: "FNP Template" }],
  openGraph: {
    title: "FNP Template",
    description: "Starter template for full-stack applications.",
    siteName: "FNP Template",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "FNP Template",
    description: "Starter template for full-stack applications.",
  },
};

export const viewport: Viewport = {
  themeColor: "#111827",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-gray-50 antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
