import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Healthcare AI Dashboard",
  description: "Federated learning healthcare dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col px-4 py-6 md:px-8">
          <nav className="mb-6 flex items-center justify-between rounded-xl bg-white px-5 py-4 shadow-md dark:bg-slate-900">
            <Link href="/" className="text-lg font-bold md:text-xl">
              Healthcare AI Dashboard
            </Link>
            <div className="flex items-center gap-2 text-sm md:gap-4 md:text-base">
              <Link className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" href="/">
                Home
              </Link>
              <Link className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" href="/dashboard">
                Dashboard
              </Link>
              <Link className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" href="/encryption">
                Encryption
              </Link>
              <Link className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" href="/prediction">
                Prediction
              </Link>
            </div>
          </nav>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
