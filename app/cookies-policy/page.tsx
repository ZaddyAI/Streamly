import Link from "next/link"
import { ArrowLeft, Sparkles, Check } from "@/components/icons"

export const metadata = {
    title: "Cookies Policy — Streamly",
    description: "Learn how Streamly utilizes essential cookies and local browser storage without requiring user authorization or personal accounts.",
}

export default function CookiesPolicyPage() {
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
                        <span>Policy & Data Storage</span>
                    </span>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#F7F7FC] tracking-tight">
                        Cookies & Local Storage Policy
                    </h1>

                    <p className="text-xs sm:text-sm text-[#929BB0] max-w-2xl leading-relaxed">
                        Last Updated: October 2026. Streamly operates without user accounts, sign-ups, or personal identity tracking. Learn how local browser memory supports your streaming experience.
                    </p>
                </div>
            </div>

            {/* Content Cards */}
            <div className="space-y-6 text-[#929BB0] text-xs sm:text-sm leading-relaxed">
                {/* Section 1: Overview */}
                <section className="rounded-2xl p-6 bg-[#101522] border border-white/[0.08] space-y-3">
                    <h2 className="text-base sm:text-lg font-bold text-[#F7F7FC]">
                        1. Introduction & Zero-Account Philosophy
                    </h2>
                    <p>
                        Streamly is designed from the ground up as a frictionless, free streaming entertainment guide and player.
                        <strong> We do not require registration, authorization, passwords, or personal profile creation.</strong>
                    </p>
                    <p>
                        Because we do not store accounts on central databases, Streamly relies on client-side storage technologies—primarily HTML5 LocalStorage and essential session cookies—to remember your choices directly on your own device.
                    </p>
                </section>

                {/* Section 2: What We Store Locally */}
                <section id="storage" className="rounded-2xl p-6 bg-[#101522] border border-white/[0.08] space-y-4">
                    <h2 className="text-base sm:text-lg font-bold text-[#F7F7FC]">
                        2. How We Use LocalStorage & Essential Cookies
                    </h2>
                    <p>
                        Unlike commercial platforms that track cross-site advertising identifiers, our local storage is strictly functional and restricted to enhancing your immediate user experience:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 rounded-xl bg-[#171C2C] border border-white/[0.06] space-y-2">
                            <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
                                <span className="w-2 h-2 rounded-full bg-[#9165FF]" />
                                <span>Personal Watchlist</span>
                            </div>
                            <p className="text-xs text-[#929BB0]">
                                When you bookmark movies or TV shows to &ldquo;My List&rdquo;, the items are stored exclusively in your browser&apos;s localStorage (<code className="text-[#B69AFF]">streamly_watchlist</code>).
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-[#171C2C] border border-white/[0.06] space-y-2">
                            <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                <span>Watched Episodes Progress</span>
                            </div>
                            <p className="text-xs text-[#929BB0]">
                                Marked episodes and playback positions are remembered locally (<code className="text-[#B69AFF]">streamly_watched_episodes</code>) so you can resume series seamlessly.
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-[#171C2C] border border-white/[0.06] space-y-2">
                            <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
                                <span className="w-2 h-2 rounded-full bg-amber-400" />
                                <span>Playback Preferences</span>
                            </div>
                            <p className="text-xs text-[#929BB0]">
                                Your preferred streaming server choice and UI display settings (such as compact tile grid vs. detailed list view) are cached for convenience.
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-[#171C2C] border border-white/[0.06] space-y-2">
                            <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
                                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                                <span>Cookie Consent Choice</span>
                            </div>
                            <p className="text-xs text-[#929BB0]">
                                A simple flag (<code className="text-[#B69AFF]">streamly_cookie_consent</code>) records your dismissal of the startup notice so you aren&apos;t repeatedly prompted.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 3: Third-Party Embedded Players */}
                <section className="rounded-2xl p-6 bg-[#101522] border border-white/[0.08] space-y-3">
                    <h2 className="text-base sm:text-lg font-bold text-[#F7F7FC]">
                        3. Third-Party Embedded Video Players
                    </h2>
                    <p>
                        When you launch a movie or television episode player, the stream is delivered via sandboxed third-party video embed servers (such as VidFast, VidKing, StreamFlix, etc.).
                    </p>
                    <p>
                        These third-party iframe providers may utilize their own session cookies or video caching mechanisms to manage video buffer health, resolution adaptation, and server load balancing. Streamly has no direct access to, or control over, cookies set by external embedded domains.
                    </p>
                </section>

                {/* Section 4: How to Manage or Clear Your Storage */}
                <section className="rounded-2xl p-6 bg-[#101522] border border-white/[0.08] space-y-3">
                    <h2 className="text-base sm:text-lg font-bold text-[#F7F7FC]">
                        4. Managing & Clearing Your Browser Data
                    </h2>
                    <p>
                        You have complete control over data stored on your device:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs">
                        <li>
                            You can clear your local storage at any time by opening your browser settings and selecting &ldquo;Clear Browsing Data &gt; Cookies and site data&rdquo;.
                        </li>
                        <li>
                            Clearing your data will reset your saved watchlist and episode tracking, restoring Streamly to its original default state.
                        </li>
                        <li>
                            You can browse Streamly in Private / Incognito mode if you prefer all local storage to be automatically deleted when your session window closes.
                        </li>
                    </ul>
                </section>

                {/* Section 5: Contact */}
                <section className="rounded-2xl p-6 bg-[#101522] border border-white/[0.08] space-y-3">
                    <h2 className="text-base sm:text-lg font-bold text-[#F7F7FC]">
                        5. Questions & Contact
                    </h2>
                    <p>
                        If you have questions about our local storage implementation or privacy approach, please visit our open-source project repository or read our accompanying{" "}
                        <Link href="/privacy-policy" className="text-[#B69AFF] hover:underline font-semibold">
                            Privacy Policy
                        </Link>.
                    </p>
                </section>
            </div>
        </div>
    )
}
