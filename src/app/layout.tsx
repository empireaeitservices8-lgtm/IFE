
import type { Metadata } from "next";
import { Space_Grotesk, Work_Sans } from "next/font/google";
import BackToTop from "@/components/ui/BackToTop";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "IFE | International Fashion Entertainment",
  description:
    "Discover extraordinary fashion shows, entertainment events and exclusive experiences with IFE.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${workSans.variable} antialiased`}>
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
