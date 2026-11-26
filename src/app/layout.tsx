import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "nailed...ish — How close can you get?",
  description: "Five questions. Daily. How close can you get?"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
