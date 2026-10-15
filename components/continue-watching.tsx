"use client"

import Link from "next/link"
import { PlayIcon, Clock, Film } from "@/components/icons"
import { getBackdropUrl } from "@/lib/tmdb"
import { SafeImage } from "@/components/safe-image"
import { useContinueWatching } from "@/hooks/use-continue-watching"
import { formatRemainingTime } from "@/lib/continue-watching"

export interface ContinueWatchingItem {
    id: number
    key?: string
    title: string
    subtitle: string
    backdrop_path: string | null
    progress: number // 0 to 100
    remainingTime: string
    type: "movie" | "tv"
    season?: number
    episode?: number
}

interface ContinueWatchingProps {
    items?: ContinueWatchingItem[]
}

export function ContinueWatching({ items }: ContinueWatchingProps) {
    const { items: savedEntries, loaded } = useContinueWatching()

    // 1. Real watch history saved on the watch page
    const realItems: ContinueWatchingItem[] = savedEntries.map((entry) => ({
        id: entry.id,
        key: `${entry.type}-${entry.id}`,
        title: entry.title,
        subtitle:
            entry.type === "tv" && entry.season && entry.episode
                ? `Season ${entry.season} · Episode ${entry.episode}`
                : "Movie",
        backdrop_path: entry.backdrop_path,
        progress: entry.progress,
        remainingTime: formatRemainingTime(entry.currentTime, entry.duration),
        type: entry.type,
        season: entry.season,
        episode: entry.episode,
    }))

    // 2. Explicitly passed items take over only when nothing is saved locally
    const passedItems: ContinueWatchingItem[] = (items || []).map((item) => ({
        ...item,
        key: item.key || `${item.type}-${item.id}`,
    }))

    const displayItems: ContinueWatchingItem[] =
        realItems.length > 0 ? realItems : passedItems

    // Avoid flashing the empty state before localStorage has been read
    if (!loaded) {
        return (
            <section className="space-y-3.5" aria-label="Continue Watching" aria-busy="true">
                <div className="flex items-center gap-2">
                    <span className="text-[#9165FF] flex items-center">
                        <Clock className="w-4 h-4" />
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-[#F7F7FC] tracking-tight">
                        Continue Watching
                    </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="rounded-2xl overflow-hidden bg-[#101522] border border-white/[0.08] animate-pulse"
                        >
                            <div className="aspect-video w-full bg-[#171C2C]" />
                            <div className="h-1 bg-white/[0.05]" />
                        </div>
                    ))}
                </div>
            </section>
        )
    }

    // Empty state: nothing watched yet — invite the user to start watching
    if (displayItems.length === 0) {
        return (
            <section className="space-y-3.5" aria-label="Continue Watching">
                <div className="flex items-center gap-2">
                    <span className="text-[#9165FF] flex items-center">
                        <Clock className="w-4 h-4" />
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-[#F7F7FC] tracking-tight">
                        Continue Watching
                    </h2>
                </div>
                <Link
                    href="/movies"
                    className="group flex items-center gap-4 p-5 rounded-2xl bg-[#101522] border border-white/[0.08] hover:border-[#9165FF]/40 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_25px_rgba(145,101,255,0.2)] transition-all duration-300"
                >
                    <div className="w-12 h-12 rounded-full bg-[#9165FF]/20 border border-[#9165FF]/40 flex items-center justify-center text-[#B69AFF] shrink-0 group-hover:bg-[#9165FF]/30 transition-colors">
                        <Film className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#F7F7FC] group-hover:text-[#B69AFF] transition-colors">
                            Nothing here yet
                        </p>
                        <p className="text-xs text-[#929BB0] truncate">
                            Start watching something and it&apos;ll show up here
                        </p>
                    </div>
                    <span className="ml-auto shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#9165FF] text-white text-xs font-semibold shadow-[0_0_15px_rgba(145,101,255,0.4)] group-hover:shadow-[0_0_20px_rgba(145,101,255,0.6)] transition-all">
                        <PlayIcon className="w-3 h-3 ml-0.5 fill-current" />
                        Browse
                    </span>
                </Link>
            </section>
        )
    }

    const watchHref = (item: ContinueWatchingItem) =>
        item.type === "tv" && item.season && item.episode
            ? `/watch/${item.id}?type=tv&season=${item.season}&episode=${item.episode}`
            : `/watch/${item.id}?type=${item.type}`

    return (
        <section className="space-y-3.5" aria-label="Continue Watching">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-[#9165FF] flex items-center">
                        <Clock className="w-4 h-4" />
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-[#F7F7FC] tracking-tight">
                        Continue Watching
                    </h2>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayItems.map((item) => {
                    return (
                        <Link
                            key={item.key || `${item.type}-${item.id}`}
                            href={watchHref(item)}
                            className="group relative block rounded-2xl overflow-hidden bg-[#101522] border border-white/[0.08] hover:border-[#9165FF]/40 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_25px_rgba(145,101,255,0.2)] transition-all duration-300"
                        >
                            {/* Landscape Thumbnail */}
                            <div className="relative aspect-video w-full overflow-hidden bg-[#171C2C]">
                                <SafeImage
                                    src={item.backdrop_path ? getBackdropUrl(item.backdrop_path, "w780") : "/placeholder-landscape.svg"}
                                    fallbackSrc="/placeholder-landscape.svg"
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                />

                                {/* Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-[#05070D]/40 to-transparent opacity-90 transition-opacity group-hover:opacity-75" />

                                {/* Center Play Button */}
                                <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-[#9165FF] text-white flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-[0_0_15px_rgba(145,101,255,0.7)]">
                                    <PlayIcon className="w-3.5 h-3.5 ml-0.5 fill-current" />
                                </div>

                                {/* Remaining Time Badge in Top Right */}
                                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-medium text-white/90 border border-white/10">
                                    {item.remainingTime}
                                </div>

                                {/* Content Details Over Thumbnail */}
                                <div className="absolute bottom-2 inset-x-3 space-y-0.5 z-10">
                                    <h3 className="text-xs sm:text-sm font-bold text-[#F7F7FC] truncate group-hover:text-[#B69AFF] transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-[11px] text-[#929BB0] truncate">{item.subtitle}</p>
                                </div>
                            </div>

                            {/* Thin Violet Progress Bar (theme.md Section 3.E) */}
                            <div className="w-full h-1 bg-white/[0.08] relative overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#9165FF] to-[#B69AFF] shadow-[0_0_8px_#9165FF] rounded-r-full transition-all duration-300"
                                    style={{ width: `${item.progress}%` }}
                                />
                            </div>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}
