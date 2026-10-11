"use client"

import type React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import {
    Home,
    Film,
    Tv,
    Compass,
    Bookmark,
    Search,
    Menu,
    X,
    StreamlyMark,
    StreamlyWordmark,
} from "@/components/icons"
import { searchMulti, getImageUrl } from "@/lib/tmdb"
import type { Movie, TVShow } from "@/lib/tmdb"
import { SafeImage } from "@/components/safe-image"
import { cn } from "@/lib/utils"
import { useWatchlist } from "@/hooks/use-watchlist"
import { Footer } from "@/components/footer"
import { CookieBanner } from "@/components/cookie-banner"

interface NavItem {
    href: string
    label: string
    icon: React.ComponentType<{ className?: string }>
}

const NAV_ITEMS: NavItem[] = [
    { href: "/", label: "Home", icon: Home },
    { href: "/movies", label: "Movies", icon: Film },
    { href: "/tv-shows", label: "TV Shows", icon: Tv },
    { href: "/genres", label: "Genres", icon: Compass },
    { href: "/my-list", label: "My List", icon: Bookmark },
]

function BrandLogo({ onNavigate, size = "lg" }: { onNavigate?: () => void; size?: "sm" | "lg" }) {
    return (
        <Link
            href="/"
            className="flex items-center gap-3 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9165FF] rounded-xl"
            onClick={onNavigate}
        >
            <StreamlyMark size={size} />
            <StreamlyWordmark size={size} />
        </Link>
    )
}

function SidebarNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
    const { count } = useWatchlist()

    return (
        <nav className="flex flex-col gap-1.5 w-full" aria-label="Sidebar Navigation">
            {NAV_ITEMS.map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
                const Icon = item.icon

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                            "group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all duration-200 select-none",
                            active
                                ? "text-white bg-[#9165FF]/15 border border-[#9165FF]/30 shadow-[0_0_15px_rgba(145,101,255,0.15)] font-semibold"
                                : "text-[#929BB0] hover:text-[#F7F7FC] hover:bg-white/[0.04] border border-transparent",
                        )}
                    >
                        {/* Glowing Left Indicator */}
                        {active && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[#9165FF] shadow-[0_0_10px_#9165FF]" />
                        )}

                        <div className="flex items-center gap-3">
                            <Icon
                                className={cn(
                                    "w-4 h-4 transition-transform duration-200 group-hover:scale-110",
                                    active ? "text-[#B69AFF]" : "text-[#929BB0] group-hover:text-[#F7F7FC]",
                                )}
                            />
                            <span>{item.label}</span>
                        </div>

                        {item.href === "/my-list" && count > 0 && (
                            <span className="inline-flex items-center justify-center text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#9165FF]/20 text-[#B69AFF] border border-[#9165FF]/30">
                                {count}
                            </span>
                        )}
                    </Link>
                )
            })}
        </nav>
    )
}

function SearchBar({ className }: { className?: string }) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [suggestions, setSuggestions] = useState<(Movie | TVShow)[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [loading, setLoading] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.trim().length > 1) {
                setLoading(true)
                try {
                    const results = await searchMulti(searchQuery)
                    setSuggestions(results.slice(0, 5))
                    setShowSuggestions(true)
                } catch (error) {
                    console.error("[streamly] Error fetching suggestions:", error)
                } finally {
                    setLoading(false)
                }
            } else {
                setSuggestions([])
                setShowSuggestions(false)
            }
        }

        const timer = setTimeout(fetchSuggestions, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            setShowSuggestions(false)
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    const handleSuggestionClick = (item: Movie | TVShow) => {
        const isTV = "name" in item
        setShowSuggestions(false)
        setSearchQuery("")
        router.push(`/${isTV ? "tv" : "movie"}/${item.id}`)
    }

    return (
        <div ref={searchRef} className={cn("relative w-full", className)}>
            <form onSubmit={handleSearchSubmit}>
                <div className="relative flex items-center">
                    <Search className="absolute left-3.5 w-4 h-4 text-[#929BB0] pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => searchQuery.trim().length > 1 && setShowSuggestions(true)}
                        placeholder="Search movies, TV shows, actors..."
                        className="w-full h-10 pl-10 pr-9 rounded-full bg-[#101522] border border-white/[0.08] text-xs sm:text-sm text-[#F7F7FC] placeholder-[#929BB0] focus:outline-none focus:border-[#9165FF]/60 focus:ring-2 focus:ring-[#9165FF]/20 focus:bg-[#171C2C] transition-all shadow-inner"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 text-[#929BB0] hover:text-[#F7F7FC] p-0.5"
                            aria-label="Clear search"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </form>

            {/* Live Search Suggestions Dropdown */}
            {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl bg-[#101522]/95 backdrop-blur-xl border border-white/[0.08] shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden">
                    {loading && (
                        <div className="p-4 text-center text-xs text-[#929BB0] animate-pulse">
                            Searching catalog...
                        </div>
                    )}

                    {!loading && suggestions.length > 0 && (
                        <div className="py-1">
                            {suggestions.map((item) => {
                                const isTV = "name" in item
                                const title = (isTV ? item.name : item.title) || "Untitled"
                                const date = isTV ? item.first_air_date : item.release_date
                                const year = date ? new Date(date).getFullYear() : ""

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => handleSuggestionClick(item)}
                                        className="w-full flex items-center gap-3 p-2.5 hover:bg-[#171C2C] transition-colors text-left border-b border-white/[0.04] last:border-b-0 group"
                                    >
                                        <div className="relative w-9 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-[#171C2C] border border-white/[0.06]">
                                            <SafeImage
                                                src={item.poster_path ? getImageUrl(item.poster_path, "w500") : "/placeholder.svg"}
                                                fallbackSrc="/placeholder.svg"
                                                alt={title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform"
                                                sizes="36px"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs sm:text-sm font-semibold text-[#F7F7FC] truncate group-hover:text-[#B69AFF] transition-colors">
                                                {title}
                                            </p>
                                            <div className="flex items-center gap-2 text-[11px] text-[#929BB0]">
                                                <span className="uppercase text-[10px] font-bold text-[#B69AFF] px-1.5 py-0.2 rounded bg-[#9165FF]/10">
                                                    {isTV ? "TV" : "Movie"}
                                                </span>
                                                {year && <span>{year}</span>}
                                            </div>
                                        </div>
                                    </button>
                                )
                            })}

                            <div className="p-2 border-t border-white/[0.04] bg-white/[0.02]">
                                <button
                                    type="button"
                                    onClick={handleSearchSubmit}
                                    className="w-full py-1.5 text-center text-xs font-semibold text-[#B69AFF] hover:text-white transition-colors"
                                >
                                    View all results for &ldquo;{searchQuery}&rdquo; →
                                </button>
                            </div>
                        </div>
                    )}

                    {!loading && suggestions.length === 0 && searchQuery.trim().length > 1 && (
                        <div className="p-4 text-center text-xs text-[#929BB0]">
                            No matching titles found for &ldquo;{searchQuery}&rdquo;
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
    const { count: watchlistCount } = useWatchlist()

    return (
        <div className="min-h-screen flex flex-col bg-[#05070D] text-[#F7F7FC]">
            {/* Desktop Left Sidebar (Fixed 215px wide as defined in theme.md Section 2) */}
            <aside
                className="hidden lg:flex flex-col justify-between fixed top-0 bottom-0 left-0 w-[215px] z-40 bg-[#090D18] border-r border-white/[0.08] p-5 select-none"
                aria-label="Main Sidebar"
            >
                <div className="space-y-8">
                    {/* Brand Mark + Wordmark */}
                    <div className="pt-1">
                        <BrandLogo />
                    </div>

                    {/* Navigation Items */}
                    <div className="space-y-1">
                        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#929BB0]/70">
                            Menu
                        </div>
                        <SidebarNav pathname={pathname} />
                    </div>
                </div>

                {/* Sidebar Bottom Clean Catalog Status */}
                <div className="pt-4 border-t border-white/[0.06] text-[11px] text-[#929BB0] space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Free Access Active</span>
                    </div>
                    <p className="text-[10px] text-[#929BB0]/70">No sign-up or authorization needed</p>
                </div>
            </aside>

            {/* Main Application Area (Padded on desktop to account for left sidebar) */}
            <div className="lg:pl-[215px] flex flex-col flex-1 min-h-screen min-w-0">
                {/* Top Navigation Bar */}
                <header className="sticky top-0 z-30 bg-[#05070D]/85 backdrop-blur-xl border-b border-white/[0.08] transition-all">
                    <div className="w-full px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between gap-3 h-16">
                            {/* Left: Mobile Logo & Mobile Drawer Toggle */}
                            <div className="flex items-center gap-3 lg:hidden">
                                <button
                                    type="button"
                                    onClick={() => setMobileDrawerOpen(true)}
                                    className="p-2 rounded-xl bg-[#101522] border border-white/[0.08] text-[#929BB0] hover:text-white hover:bg-[#171C2C] transition-all"
                                    aria-label="Open navigation menu"
                                >
                                    <Menu className="w-5 h-5" />
                                </button>
                                <BrandLogo size="sm" />
                            </div>

                            {/* Center: Search Field */}
                            <div className="flex-1 max-w-md lg:max-w-lg hidden sm:block">
                                <SearchBar />
                            </div>

                            {/* Right: Clean Uncluttered Status Badge */}
                            <div className="flex items-center gap-3 ml-auto">
                                {/* Search Icon for extra small screens */}
                                <div className="sm:hidden">
                                    <Link
                                        href="/search"
                                        className="p-2 rounded-xl bg-[#101522] border border-white/[0.08] text-[#929BB0] hover:text-white flex items-center justify-center"
                                        aria-label="Search"
                                    >
                                        <Search className="w-4 h-4" />
                                    </Link>
                                </div>

                                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101522] border border-white/[0.08] text-xs font-semibold text-[#B69AFF]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    <span>Streamly Directory</span>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Search Bar below header on mobile screens */}
                        <div className="sm:hidden pb-3">
                            <SearchBar />
                        </div>
                    </div>
                </header>

                {/* Mobile Drawer (When Opened) */}
                {mobileDrawerOpen && (
                    <div className="lg:hidden fixed inset-0 z-50 flex">
                        <div
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                            onClick={() => setMobileDrawerOpen(false)}
                            aria-hidden="true"
                        />
                        <div className="relative z-50 w-72 max-w-[80vw] bg-[#090D18] border-r border-white/[0.08] p-5 flex flex-col justify-between h-full shadow-2xl animate-in slide-in-from-left duration-200">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                                    <BrandLogo onNavigate={() => setMobileDrawerOpen(false)} />
                                    <button
                                        type="button"
                                        onClick={() => setMobileDrawerOpen(false)}
                                        className="p-1.5 rounded-lg text-[#929BB0] hover:text-white hover:bg-white/[0.05]"
                                        aria-label="Close menu"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <SidebarNav pathname={pathname} onNavigate={() => setMobileDrawerOpen(false)} />
                            </div>

                            <div className="pt-4 border-t border-white/[0.08] text-[11px] text-[#929BB0] space-y-1">
                                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    <span>Free Stream Access</span>
                                </div>
                                <p className="text-[10px] text-[#929BB0]/70">No account required</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content Body */}
                <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-20 md:pb-12 max-w-[1720px] mx-auto">
                    {children}
                </main>

                {/* Redesigned Footer (Always at Bottom) */}
                <Footer />
            </div>

            {/* Startup Cookie Acceptance Banner (Bottom Right) */}
            <CookieBanner />

            {/* Mobile Bottom Navigation Bar (Section 8. Mobile requirement) */}
            <nav
                className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090D18]/95 backdrop-blur-xl border-t border-white/[0.08] px-3 py-2 flex items-center justify-around"
                aria-label="Mobile Bottom Navigation"
            >
                {NAV_ITEMS.map((item) => {
                    const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors relative",
                                active ? "text-[#B69AFF]" : "text-[#929BB0] hover:text-white",
                            )}
                        >
                            <Icon className={cn("w-4 h-4", active && "text-[#B69AFF]")} />
                            <span>{item.label}</span>
                            {item.href === "/my-list" && watchlistCount > 0 && (
                                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-[#9165FF] ring-2 ring-[#090D18]" />
                            )}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
