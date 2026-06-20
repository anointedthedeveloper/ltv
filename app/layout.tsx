import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Live TV - Stream African & Global Channels",
  description: "Watch live TV channels from around the world including African Magic, DStv, and international broadcasts. Stream news, sports, entertainment, and educational content.",
  keywords: ["live TV", "streaming", "African Magic", "DStv", "channels", "broadcast"],
  openGraph: {
    title: "Live TV - Stream African & Global Channels",
    description: "Your ultimate destination for live TV streaming",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-white dark:bg-neutral-950`}
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-neutral-950">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
