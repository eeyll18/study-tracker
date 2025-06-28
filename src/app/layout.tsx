import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ders Çalışma Takibi",
  description: "Next.js ile ders çalışma takibi uygulaması",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900`}>
        <main className="container mx-auto p-4">{children}</main>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
