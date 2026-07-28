import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "EUIPO Assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Registers <scavenger-chat-anonymous> custom element.
            In production swap this src for the CDN URL. */}
        <Script src="/scavenger-chat-anonymous.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
