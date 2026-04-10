import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";
import { Briefcase } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gestor de Obras",
  description: "Gestiona tus obras y entregas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Briefcase className="h-5 w-5" />
              <span>Gestor de Obras</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Inicio
              </Link>
              <Link
                href="/works"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Obras
              </Link>
              <Link
                href="/works/new"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
              >
                Nueva Obra
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
