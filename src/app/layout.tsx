import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FairDegens | Anti-Snipe Protocol",
  description: "The FHE-secured launchpad where snipers can't front-run you.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
