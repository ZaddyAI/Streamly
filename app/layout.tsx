import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
    title: "Streamly - Stream Movies & TV Shows",
    description: "Watch unlimited movies and TV shows online",
    generator: "Gambhir Poudel",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
                <Suspense fallback={null}>{children}</Suspense>
                <Analytics />
            </body>
        </html>
    )
}
