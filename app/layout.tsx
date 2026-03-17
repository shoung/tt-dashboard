import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TT Agent Dashboard",
  description: "AI Agent Status Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-tw">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" 
          rel="stylesheet" 
        />
        <link 
          href="https://cdn.jsdelivr.net/npm/@fullcalendar/core@6.1.10/main.min.css" 
          rel="stylesheet" 
        />
        <link 
          href="https://cdn.jsdelivr.net/npm/@fullcalendar/daygrid@6.1.10/main.min.css" 
          rel="stylesheet" 
        />
        <link 
          href="https://cdn.jsdelivr.net/npm/@fullcalendar/timegrid@6.1.10/main.min.css" 
          rel="stylesheet" 
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
