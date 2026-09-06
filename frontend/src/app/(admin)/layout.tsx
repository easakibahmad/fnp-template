import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-access-display",
  weight: ["500", "600"],
});

const ibmSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-access-sans",
  weight: ["400", "500", "600"],
});

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-access-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Access Control",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div
      className={`access-shell min-h-screen ${fraunces.variable} ${ibmSans.variable} ${ibmMono.variable}`}
    >
      <header className="access-header">
        <div className="access-header-inner">
          <div className="flex items-center gap-4">
            <Link href="/" className="access-back-link">
              <ArrowLeft size={14} strokeWidth={2} />
              Return home
            </Link>
            <div className="h-4 w-px bg-[var(--access-rule-line)]" />
            <div>
              <p className="access-eyebrow">FNP Template Admin</p>
              <h1 className="access-title">Access Control</h1>
            </div>
          </div>
          <p className="access-signed-in">
            Signed in as <span className="font-medium">{user.name}</span>
          </p>
        </div>
      </header>
      <main className="access-main">{children}</main>
    </div>
  );
}
