import type { Metadata } from "next";

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
        <link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/main.min.css" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
