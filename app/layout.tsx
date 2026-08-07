import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL_FALLBACK } from "@/lib/site";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL_FALLBACK),
  title: {
    default: `${SITE_NAME} | Remaja Masjid At-Ta'awun Kanggotan Lor`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "RISMA Kanggotan",
    "Remaja Masjid At-Ta'awun",
    "Kanggotan",
    "Kanggotan Lor",
    "Masjid At-Ta'awun",
    "Yogyakarta",
    "kegiatan remaja masjid",
    "haul massal",
    "sponsor RISMA",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Remaja Masjid At-Ta'awun Kanggotan Lor`,
    description: SITE_DESCRIPTION,
    url: SITE_URL_FALLBACK,
    locale: "id_ID",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const hasSessionCookie = cookieStore.getAll().some((c) => c.name.includes("auth-token"))

  let user = null
  if (hasSessionCookie) {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    user = authUser
  }


  return (
    <html lang="en" className={inter.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider User={user}>{children}</AuthProvider>
      </body>
    </html>
  );
}
