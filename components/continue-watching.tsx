import Link from "next/link"
import { PlayIcon, Clock } from "@/components/icons"
import { getBackdropUrl } from "@/lib/tmdb"
import { SafeImage } from "@/components/safe-image"
import type { Movie, TVShow } from "@/lib/tmdb"

export interface ContinueWatchingItem {
    id: number
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
    featuredMovies?: Movie[]
}

export function ContinueWatching({ items, featuredMovies }: ContinueWatchingProps) {
    // If no dynamic items passed, generate realistic items from featured movies
    const validMovies = (featuredMovies || []).filter((m): m is Movie => Boolean(m && m.id))
    const displayItems: ContinueWatchingItem[] =
        items && items.length > 0
            ? items
            : validMovies.slice(0, 4).map((m, idx) => {
                const progressVals = [68, 42, 85, 25]
                const remainingVals = ["32m left", "48m left", "14m left", "1h 10m left"]
                const subtitles = [
                    "Season 2 · Episode 4",
                    "4K Ultra HD",
                    "Season 1 · Episode 7",
                    "Cinematic Edition",
                ]

                return {
                    id: m.id,
                    title: m.title || (m as any).name || "Untitled",
                    subtitle: subtitles[idx % subtitles.length],
                    backdrop_path: m.backdrop_path,
                    progress: progressVals[idx % progressVals.length],
                    remainingTime: remainingVals[idx % remainingVals.length],
                    type: idx % 2 === 0 ? "tv" : "movie",
                    season: idx % 2 === 0 ? (idx === 0 ? 2 : 1) : undefined,
                    episode: idx % 2 === 0 ? (idx === 0 ? 4 : 7) : undefined,
                }
            })

    if (displayItems.length === 0) return null

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
                    const watchHref =
                        item.type === "tv" && item.season && item.episode
                            ? `/watch/${item.id}?type=tv&season=${item.season}&episode=${item.episode}`
                            : `/watch/${item.id}?type=${item.type}`

                    return (
                        <Link
                            key={item.id}
                            href={watchHref}
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
