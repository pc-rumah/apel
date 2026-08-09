import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "SpeechPro — Stimulasi Bahasa Anak 0–36 Bulan",
  description:
    "SpeechPro membantu orang tua menstimulasi bahasa anak 0–36 bulan: skrining KPSP, latihan kata harian, catatan perkembangan, dan evaluasi mingguan.",
  openGraph: {
    siteName: "SpeechPro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800&display=swap"
        />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
