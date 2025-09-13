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
  title: "Buyer Intake - Demo",
  description: "Simple buyer intake form demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header style={{ borderBottom: '1px solid #eee' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
            <a href="/buyers" style={{ fontWeight: 600 }}>Buyer Intake Demo</a>
            <nav style={{ display: 'flex', gap: 12 }}>
              <a href="/buyers" className="btn">List</a>
              <a href="/buyers/new" className="btn">New</a>
              <a href="/buyers/import" className="btn">Import</a>
            </nav>
          </div>
        </header>
        <main className="container" style={{ paddingTop: 20, paddingBottom: 40 }}>{children}</main>
      </body>
    </html>
  );
}
