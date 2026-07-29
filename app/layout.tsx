import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "EUIPO Assistant",
};

const WIDGET_SRC =
  process.env.NEXT_PUBLIC_WIDGET_SRC ??
  "https://d2ti5h8dzkdk09.cloudfront.net/scavenger-chat-anonymous.js";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script src={WIDGET_SRC} strategy="afterInteractive" />
      </body>
    </html>
  );
}
