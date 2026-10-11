import Link from "next/link"
import { ArrowLeft, Sparkles, Crown } from "@/components/icons"

export const metadata = {
    title: "Privacy Policy — Streamly",
    description: "Read the Streamly Privacy Policy. 100% free streaming directory with zero account registration, no credit cards, and local data persistence.",
}

export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-10 py-4 sm:py-6">
            {/* Breadcrumb / Back Link */}
            <div className="flex items-center">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#929BB0] hover:text-[#F7F7FC] transition-colors bg-[#101522] border border-white/[0.08] hover:border-[#9165FF]/40 px-3.5 py-1.5 rounded-xl"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Home</span>
                </Link>
            </div>

            {/* Header Banner */}
            <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#171C2C] to-[#101522] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden">
                <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#9165FF]/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#9165FF]/20 border border-[#9165FF]/40 text-[#B69AFF]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Privacy & Transparency</span>
                    </span>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#F7F7FC] tracking-tight">
                        Privacy Policy
                    </h1>

                    <p className="text-xs sm:text-sm text-[#929BB0] max-w-2xl leading-relaxed">
                        Last Updated: October 2026. At Streamly, your privacy is paramount. We believe in open, unrestricted access to media information without collecting personal identities.
                    </p>
                </div>
            </div>

            {/* Content Cards */}
            <div className="space-y-6 text-[#929BB0] text-xs sm:text-sm leading-relaxed">
                {/* Section 1: No Account / No Authorization */}
                <section className="rounded-2xl p-6 bg-[#101522] border border-white/[0.08] space-y-3">
                    <h2 className="text-base sm:text-lg font-bold text-[#F7F7FC]">
                        1. Zero Account / No Authorization Required
                    </h2>
                    <p>
                        Streamly is built on the fundamental principle that entertainment discovery should not require handing over personal data.
                        <strong> You do not need to register an account, log in, provide an email address, or provide any payment details.</strong>
                    </p>
                    <p>
                        All streaming directory features, searches, genre filtering, and playback controls are publicly open to all users without authorization barriers.
                    </p>
                </section>

                {/* Section 2: What We Do NOT Collect */}
                <section className="rounded-2xl p-6 bg-[#101522] border border-white/[0.08] space-y-3">
                    <h2 className="text-base sm:text-lg font-bold text-[#F7F7FC]">
                        2. Information We Do NOT Collect
                    </h2>
                    <p>
                        To ensure complete transparency, Streamly explicitly does not collect:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs">
                        <li>Personal names, physical addresses, or phone numbers.</li>
                        <li>Email addresses or user authentication credentials.</li>
                        <li>Payment information, credit card details, or subscription billing records.</li>
                        <li>Behavioral advertising tracking profiles across external websites.</li>
                    </ul>
                </section>

                {/* Section 3: Technical Logs & Local Data */}
                <section className="rounded-2xl p-6 bg-[#101522] border border-white/[0.08] space-y-3">
                    <h2 className="text-base sm:text-lg font-bold text-[#F7F7FC]">
                        3. Technical Logs & Local Client Persistence
                    </h2>
                    <p>
                        When you connect to our website, standard web server logs receive temporary technical metadata (such as your IP address, browser user-agent, and requested page URL) solely to protect against automated DDoS attacks and verify network uptime.
                    </p>
                    <p>
                        Your personal watchlist (&ldquo;My List&rdquo;) and watched episodes history are stored strictly within your browser&apos;s local storage. This information is never uploaded or transmitted to our servers.
                    </p>
                </section>

                {/* Section 4: Third-Party APIs and External Content */}
                <section className="rounded-2xl p-6 bg-[#101522] border border-white/[0.08] space-y-3">
                    <h2 className="text-base sm:text-lg font-bold text-[#F7F7FC]">
                        4. Third-Party Integrations & TMDB
                    </h2>
                    <p>
                        Movie and TV metadata, summaries, release dates, and promotional posters are indexed via
                        <strong> The Movie Database (TMDB) API</strong>. This product uses the TMDB API but is not endorsed or certified by TMDB.
                    </p>
                    <p>
                        When media is fetched, requests are proxied securely or loaded directly from TMDB CDN endpoints.
                    </p>
                </section>

                {/* Section 5: Third-Party Embedded Video Hosts & DMCA */}
                <section id="disclaimer" className="rounded-2xl p-6 bg-[#101522] border border-white/[0.08] space-y-3">
                    <h2 className="text-base sm:text-lg font-bold text-[#F7F7FC]">
                        5. Third-Party Media Hosts & DMCA Disclaimer
                    </h2>
                    <p>
                        Streamly acts strictly as an informational index and search engine for streaming links available on the public internet.
                        <strong> Streamly does not host, upload, maintain, or store any video files on its servers.</strong>
                    </p>
                    <p>
                        Video playback takes place entirely via third-party iframe embeds over which we have no operational or editorial control. For any copyright or DMCA concerns, notices should be addressed directly to the third-party web host hosting the content in question.
                    </p>
                </section>

                {/* Section 6: Children's Privacy */}
                <section className="rounded-2xl p-6 bg-[#101522] border border-white/[0.08] space-y-3">
                    <h2 className="text-base sm:text-lg font-bold text-[#F7F7FC]">
                        6. Children&apos;s Privacy (COPPA)
                    </h2>
                    <p>
                        Streamly does not knowingly solicit or collect personal information from children under the age of 13. Because our service does not collect personal identifiers from any user, no child data is ever retained or stored.
                    </p>
                </section>

                {/* Section 7: Updates to This Policy */}
                <section className="rounded-2xl p-6 bg-[#101522] border border-white/[0.08] space-y-3">
                    <h2 className="text-base sm:text-lg font-bold text-[#F7F7FC]">
                        7. Policy Updates & Cookies Inquiries
                    </h2>
                    <p>
                        We may update this Privacy Policy periodically to reflect enhancements to our platform. Any changes will be posted immediately with a revised &ldquo;Last Updated&rdquo; date.
                    </p>
                    <p>
                        For further details regarding local browser storage and cookie choices, please consult our{" "}
                        <Link href="/cookies-policy" className="text-[#B69AFF] hover:underline font-semibold">
                            Cookies Policy
                        </Link>.
                    </p>
                </section>
            </div>
        </div>
    )
}
