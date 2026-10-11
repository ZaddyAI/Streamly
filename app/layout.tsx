import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Suspense } from "react"
import { SiteLayout } from "@/components/site-layout"
import { Developer } from "@/lib/constants"
import "./globals.css"

export const metadata: Metadata = {
    title: "Streamly - Cinematic Streaming Dashboard",
    description: "Watch unlimited movies and TV shows online",
    generator: Developer,
    icons: {
        icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="dark">
            <head>
                {/* Font Setup: Plus Jakarta Sans & Inter */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
                <SiteLayout>
                    <Suspense fallback={null}>{children}</Suspense>
                </SiteLayout>
            </body>
        </html>
    )
}
