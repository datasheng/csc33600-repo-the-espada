import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import "./globals.css";

// Set up Oswald font
const oswald = Oswald({
  weight: ['400', '500', '600', '700'],  // Including bold weights for strong headings
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-oswald',
});

export const metadata: Metadata = {
  title: "GoldLinks",
  description: "Compare jewelry prices across stores",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={oswald.variable}>
      <body className={`antialiased font-oswald`}>
        {children}
      </body>
    </html>
  );
}
