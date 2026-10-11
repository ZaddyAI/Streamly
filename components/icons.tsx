import * as React from "react"
import { cn } from "@/lib/utils"

/*
 * Central icon registry for Streamly.
 * Custom SVG marks live here (brand, GitHub stats, TMDB) and the
 * lucide-react icon set used across the app is re-exported so every
 * component pulls its icons from one uniform module: `@/components/icons`.
 */

/* ------------------------------- Brand marks ------------------------------ */

/** Solid play triangle used in the Streamly logo, hero CTA and media cards. */
export function PlayIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5.25 4.5v15a1 1 0 001.55.83l12-7.5a1 1 0 000-1.66l-12-7.5a1 1 0 00-1.55.83z" />
        </svg>
    )
}

/** Gradient app tile with the play glyph — the Streamly brand mark. */
export function StreamlyMark({ className, size = "lg" }: { className?: string; size?: "sm" | "md" | "lg" | "xl" }) {
    const box = size === "sm" ? "w-8 h-8 rounded-lg" : size === "xl" ? "w-11 h-11 rounded-2xl" : "w-10 h-10 rounded-xl"
    const glyph = size === "sm" ? "w-4 h-4" : size === "xl" ? "w-5 h-5" : "w-4.5 h-4.5"

    return (
        <div
            className={cn(
                box,
                "bg-gradient-to-tr from-[#9165FF] via-[#A07CFE] to-[#B69AFF] flex items-center justify-center shrink-0",
                "shadow-[0_0_20px_rgba(145,101,255,0.4)] ring-1 ring-white/20 transition-transform duration-300 hover:scale-105",
                className,
            )}
        >
            <PlayIcon className={cn(glyph, "ml-0.5 text-white drop-shadow")} />
        </div>
    )
}

/** "Streamly" wordmark with the accent dot. */
export function StreamlyWordmark({ className, size = "lg" }: { className?: string; size?: "sm" | "md" | "lg" | "xl" }) {
    const text = size === "sm" ? "text-base" : size === "xl" ? "text-2xl" : size === "md" ? "text-lg" : "text-xl"
    return (
        <span className={cn("flex items-center tracking-tight select-none", className)}>
            <span className={cn("font-extrabold text-[#F7F7FC] tracking-tight", text)}>Stream</span>
            <span className={cn("font-bold text-[#B69AFF]", text)}>ly</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#9165FF] ml-1 mt-1 shadow-[0_0_8px_#9165FF]" />
        </span>
    )
}

/* ------------------------------ Utility icons ----------------------------- */

/** Feather-style git fork (used for the GitHub fork count in the footer). */
export function GitForkIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("feather feather-git-branch", className)}
            aria-hidden="true"
        >
            <title>Git Fork</title>
            <line x1="6" y1="3" x2="6" y2="15" />
            <circle cx="18" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <path d="M18 9a9 9 0 0 1-9 9" />
        </svg>
    )
}

/** Feather-style star outline (used for the GitHub star count in the footer). */
export function StarIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("feather feather-star", className)}
            aria-hidden="true"
        >
            <title>Star</title>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    )
}

/** Official TMDB badge. */
export function TmdbLogo({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 190.24 81.52"
            className={cn("h-6 w-auto", className)}
            role="img"
            aria-label="TMDB"
        >
            <defs>
                <linearGradient id="tmdb-gradient" y1="40.76" x2="190.24" y2="40.76" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#90cea1" />
                    <stop offset="0.56" stopColor="#3cbec9" />
                    <stop offset="1" stopColor="#00b3e5" />
                </linearGradient>
            </defs>
            <title>TMDB</title>
            <g id="Layer_2" data-name="Layer 2">
                <g id="Layer_1-2" data-name="Layer 1">
                    <path fill="url(#tmdb-gradient)" d="M105.67,36.06h66.9A17.67,17.67,0,0,0,190.24,18.4h0A17.67,17.67,0,0,0,172.57.73h-66.9A17.67,17.67,0,0,0,88,18.4h0A17.67,17.67,0,0,0,105.67,36.06Zm-88,45h76.9A17.67,17.67,0,0,0,112.24,63.4h0A17.67,17.67,0,0,0,94.57,45.73H17.67A17.67,17.67,0,0,0,0,63.4H0A17.67,17.67,0,0,0,17.67,81.06ZM10.41,35.42h7.8V6.92h10.1V0H.31v6.9h10.1Zm28.1,0h7.8V8.25h.1l9,27.15h6l9.3-27.15h.1V35.4h7.8V0H66.76l-8.2,23.1h-.1L50.31,0H38.51ZM152.43,55.67a15.07,15.07,0,0,0-4.52-5.52,18.57,18.57,0,0,0-6.68-3.08,33.54,33.54,0,0,0-8.07-1h-11.7v35.4h12.75a24.58,24.58,0,0,0,7.55-1.15A19.34,19.34,0,0,0,148.11,77a16.27,16.27,0,0,0,4.37-5.5,16.91,16.91,0,0,0,1.63-7.58A18.5,18.5,0,0,0,152.43,55.67ZM145,68.6A8.8,8.8,0,0,1,142.36,72a10.7,10.7,0,0,1-4,1.82,21.57,21.57,0,0,1-5,.55h-4.05v-21h4.6a17,17,0,0,1,4.67.63,11.66,11.66,0,0,1,3.88,1.87A9.14,9.14,0,0,1,145,59a9.87,9.87,0,0,1,1,4.52A11.89,11.89,0,0,1,145,68.6Zm44.63-.13a8,8,0,0,0-1.58-2.62A8.38,8.38,0,0,0,185.63,64a10.31,10.31,0,0,0-3.17-1v-.1a9.22,9.22,0,0,0,4.42-2.82,7.43,7.43,0,0,0,1.68-5,8.42,8.42,0,0,0-1.15-4.65,8.09,8.09,0,0,0-3-2.72,12.56,12.56,0,0,0-4.18-1.3,32.84,32.84,0,0,0-4.62-.33h-13.2v35.4h14.5a22.41,22.41,0,0,0,4.72-.5,13.53,13.53,0,0,0,4.28-1.65,9.42,9.42,0,0,0,3.1-3,8.52,8.52,0,0,0,1.2-4.68A9.39,9.39,0,0,0,189.66,68.47ZM170.21,52.72h5.3a10,10,0,0,1,1.85.18,6.18,6.18,0,0,1,1.7.57,3.39,3.39,0,0,1,1.22,1.13,3.22,3.22,0,0,1,.48,1.82,3.63,3.63,0,0,1-.43,1.8,3.4,3.4,0,0,1-1.12,1.2,4.92,4.92,0,0,1-1.58.65,7.51,7.51,0,0,1-1.77.2h-5.65Zm11.72,20a3.9,3.9,0,0,1-1.22,1.3,4.64,4.64,0,0,1-1.68.7,8.18,8.18,0,0,1-1.82.2h-7v-8h5.9a15.35,15.35,0,0,1,2,.15,8.47,8.47,0,0,1,2.05.55,4,4,0,0,1,1.57,1.18,3.11,3.11,0,0,1,.63,2A3.71,3.71,0,0,1,181.93,72.72Z" />
                </g>
            </g>
        </svg>
    )
}

/* ------------------------------ lucide re-exports ------------------------- */
export {
    Home,
    Film,
    Tv,
    Flame,
    Search,
    Menu,
    X,
    Play,
    Info,
    Download,
    MoreHorizontal,
    Star,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Clock,
    Loader2,
    ArrowLeft,
    Server,
    Monitor,
    CheckCircle,
    XCircle,
    Github,
    Crown,
    Bookmark,
    BookmarkCheck,
    Compass,
    Plus,
    Check,
    Sparkles,
    Bell,
    User,
    Layers,
    Grid,
    SlidersHorizontal,
    Share2,
    ExternalLink,
    TrendingUp,
    List,
    LayoutGrid,
    SkipBack,
    SkipForward,
    ArrowRight,
} from "lucide-react"
