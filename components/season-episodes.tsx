"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Link from "next/link"
import {
    ChevronLeft,
    ChevronRight,
    Search,
    PlayIcon,
    Check,
    List,
    LayoutGrid,
    Calendar,
    Star,
    Sparkles,
    Layers,
} from "@/components/icons"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSeasonDetails } from "@/lib/tmdb"
import type { Episode, Season } from "@/lib/tmdb"
import { cn } from "@/lib/utils"
import { SafeImage } from "@/components/safe-image"

interface SeasonEpisodesProps {
    tvId: number
    seasons: Season[]
    totalSeasonsCount?: number
}

const EPISODES_PER_PAGE = 24

export function SeasonEpisodes({ tvId, seasons, totalSeasonsCount }: SeasonEpisodesProps) {
    // 1. Build a complete, comprehensive list of all seasons (ensures no seasons are missing)
    const mainSeasons = useMemo(() => {
        const rawMap = new Map<number, Season>()
        seasons.forEach((s) => {
            if (s.season_number > 0) {
                rawMap.set(s.season_number, s)
            }
        })

        // Determine the highest known season number
        const maxFromList = Math.max(0, ...Array.from(rawMap.keys()))
        const highestSeason = Math.max(maxFromList, totalSeasonsCount || 0)

        const completeList: Season[] = []
        for (let num = 1; num <= highestSeason; num++) {
            if (rawMap.has(num)) {
                completeList.push(rawMap.get(num)!)
            } else {
                completeList.push({
                    id: num,
                    name: `Season ${num}`,
                    season_number: num,
                    episode_count: 0,
                    poster_path: null,
                    overview: "",
                    air_date: ""
                })
            }
        }

        return completeList
    }, [seasons, totalSeasonsCount])

    const [activeSeason, setActiveSeason] = useState(mainSeasons[0]?.season_number ?? 1)
    const [episodes, setEpisodes] = useState<Episode[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    // View controls
    const [viewMode, setViewMode] = useState<"cards" | "grid">("cards")
    const [seasonBarLayout, setSeasonBarLayout] = useState<"row" | "wrap">("row")
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    // Season bar horizontal scroll controls & refs
    const seasonScrollRef = useRef<HTMLDivElement>(null)
    const [canScrollSeasonLeft, setCanScrollSeasonLeft] = useState(false)
    const [canScrollSeasonRight, setCanScrollSeasonRight] = useState(true)

    // Watched episodes local tracking
    const [watchedMap, setWatchedMap] = useState<Record<string, boolean>>({})

    useEffect(() => {
        try {
            const raw = localStorage.getItem("streamly_watched_episodes")
            if (raw) setWatchedMap(JSON.parse(raw))
        } catch {
            // Ignore
        }
    }, [])

    const activeSeasonMeta = useMemo(
        () => mainSeasons.find((s) => s.season_number === activeSeason) || mainSeasons[0],
        [mainSeasons, activeSeason],
    )

    // Check season bar scroll buttons
    const checkSeasonScroll = () => {
        if (seasonScrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = seasonScrollRef.current
            setCanScrollSeasonLeft(scrollLeft > 10)
            setCanScrollSeasonRight(scrollLeft < scrollWidth - clientWidth - 10)
        }
    }

    const scrollSeasonBar = (direction: "left" | "right") => {
        if (seasonScrollRef.current) {
            const amount = seasonScrollRef.current.clientWidth * 0.75
            seasonScrollRef.current.scrollBy({
                left: direction === "left" ? -amount : amount,
                behavior: "smooth",
            })
            setTimeout(checkSeasonScroll, 300)
        }
    }

    // Horizontal wheel scroll handler for mouse users on Windows
    const handleSeasonWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (seasonScrollRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault()
            seasonScrollRef.current.scrollLeft += e.deltaY
            checkSeasonScroll()
        }
    }

    useEffect(() => {
        checkSeasonScroll()
        // Auto scroll active season button into center of view
        if (seasonScrollRef.current) {
            const activeBtn = seasonScrollRef.current.querySelector(
                `[data-season="${activeSeason}"]`,
            ) as HTMLElement | null
            if (activeBtn) {
                activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
            }
        }
        const timer = setTimeout(checkSeasonScroll, 400)
        return () => clearTimeout(timer)
    }, [activeSeason, mainSeasons, seasonBarLayout])

    // Fetch episodes when activeSeason changes
    useEffect(() => {
        let cancelled = false

        const fetchEpisodes = async () => {
            setLoading(true)
            setError(false)
            setEpisodes([])
            setCurrentPage(1)
            setSearchQuery("")
            try {
                const data = await getSeasonDetails(tvId, activeSeason)
                if (!cancelled) {
                    setEpisodes(data.episodes || [])
                }
            } catch (err) {
                console.error("[streamly] Error fetching season episodes:", err)
                if (!cancelled) setError(true)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchEpisodes()
        return () => {
            cancelled = true
        }
    }, [tvId, activeSeason])

    // Filter episodes based on user search query (by episode number or title/overview)
    const filteredEpisodes = useMemo(() => {
        if (!searchQuery.trim()) return episodes
        const query = searchQuery.trim().toLowerCase()
        const numQuery = parseInt(query, 10)

        return episodes.filter((ep) => {
            if (!isNaN(numQuery) && ep.episode_number === numQuery) return true
            return (
                ep.name?.toLowerCase().includes(query) ||
                ep.overview?.toLowerCase().includes(query) ||
                `episode ${ep.episode_number}`.includes(query) ||
                `ep ${ep.episode_number}`.includes(query)
            )
        })
    }, [episodes, searchQuery])

    // Pagination calculations
    const totalPages = Math.ceil(filteredEpisodes.length / EPISODES_PER_PAGE) || 1
    const safeCurrentPage = Math.min(currentPage, totalPages)

    const paginatedEpisodes = useMemo(() => {
        const start = (safeCurrentPage - 1) * EPISODES_PER_PAGE
        return filteredEpisodes.slice(start, start + EPISODES_PER_PAGE)
    }, [filteredEpisodes, safeCurrentPage])

    // Range batches for fast jumping (e.g. 1-24, 25-48, 49-72... for 100s or 1000s of episodes)
    const batchRanges = useMemo(() => {
        if (episodes.length <= EPISODES_PER_PAGE) return []
        const ranges = []
        for (let i = 0; i < episodes.length; i += EPISODES_PER_PAGE) {
            const startEp = i + 1
            const endEp = Math.min(i + EPISODES_PER_PAGE, episodes.length)
            const pageIndex = Math.floor(i / EPISODES_PER_PAGE) + 1
            ranges.push({
                label: `Ep ${startEp}–${endEp}`,
                page: pageIndex,
            })
        }
        return ranges
    }, [episodes.length])

    // Season batches for fast jumping when there are dozens of seasons (e.g., Seasons 1-10, 11-20, 21-30)
    const seasonBatches = useMemo(() => {
        if (mainSeasons.length <= 10) return []
        const batches = []
        for (let i = 0; i < mainSeasons.length; i += 10) {
            const startS = i + 1
            const endS = Math.min(i + 10, mainSeasons.length)
            batches.push({
                label: `S${startS}–S${endS}`,
                startSeason: startS,
            })
        }
        return batches
    }, [mainSeasons])

    if (mainSeasons.length === 0) return null

    return (
        <div className="space-y-6 pt-6 border-t border-white/[0.08]" aria-label="Episodes and Seasons">
            {/* Header: Title, Season Count, Season Dropdown & View Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                    <h2 className="text-base sm:text-lg font-bold text-[#F7F7FC] tracking-tight flex items-center gap-2">
                        <span>Seasons & Episodes</span>
                        {mainSeasons.length > 1 && (
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#9165FF]/15 border border-[#9165FF]/30 text-[#B69AFF]">
                                {mainSeasons.length} Seasons
                            </span>
                        )}
                    </h2>
                    {!loading && (
                        <p className="text-xs text-[#929BB0]">
                            {activeSeasonMeta?.name} · {episodes.length}{" "}
                            {episodes.length === 1 ? "episode" : "episodes"}
                        </p>
                    )}
                </div>

                {/* Season Dropdown & View Toggle */}
                <div className="flex items-center gap-2.5">
                    {/* Season Dropdown (Gives instant access to ALL seasons 1 to 50+) */}
                    <div className="w-48 sm:w-56">
                        <Select
                            value={activeSeason.toString()}
                            onValueChange={(val) => setActiveSeason(Number(val))}
                        >
                            <SelectTrigger className="w-full bg-[#101522] border-white/[0.08] text-xs font-semibold text-[#F7F7FC] rounded-xl h-9 hover:border-[#9165FF]/40">
                                <SelectValue placeholder="Choose Season" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#101522] border-white/[0.1] text-white max-h-80">
                                {mainSeasons.map((season) => (
                                    <SelectItem
                                        key={season.season_number}
                                        value={season.season_number.toString()}
                                        className="text-xs font-medium hover:bg-[#171C2C] focus:bg-[#171C2C]"
                                    >
                                        {season.name}{" "}
                                        {season.episode_count ? `(${season.episode_count} eps)` : ""}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* View Switcher: Detailed Cards vs. Compact Number Grid */}
                    <div className="flex items-center rounded-xl bg-[#101522] border border-white/[0.08] p-0.5">
                        <button
                            type="button"
                            onClick={() => setViewMode("cards")}
                            title="Detailed Cards View"
                            aria-label="Detailed list view"
                            className={cn(
                                "p-1.5 rounded-lg transition-all",
                                viewMode === "cards"
                                    ? "bg-[#9165FF] text-white shadow-[0_0_10px_rgba(145,101,255,0.4)]"
                                    : "text-[#929BB0] hover:text-[#F7F7FC]",
                            )}
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("grid")}
                            title="Compact Grid Tile View"
                            aria-label="Compact grid tile view"
                            className={cn(
                                "p-1.5 rounded-lg transition-all",
                                viewMode === "grid"
                                    ? "bg-[#9165FF] text-white shadow-[0_0_10px_rgba(145,101,255,0.4)]"
                                    : "text-[#929BB0] hover:text-[#F7F7FC]",
                            )}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Season Bar Controls & Layout (Fixes the 14-season limit by providing permanent flanking controls, wheel scrolling, & wrap mode) */}
            {mainSeasons.length > 1 && (
                <div className="space-y-2.5 bg-[#101522]/60 p-3.5 rounded-2xl border border-white/[0.06]">
                    {/* Top sub-bar: Batch Jumps & Wrap Toggle */}
                    <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                        {/* Quick Season Batch Jumps (e.g. S1–S10, S11–S20...) */}
                        {seasonBatches.length > 0 ? (
                            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-0.5">
                                <span className="text-[11px] text-[#929BB0] font-medium mr-1 hidden sm:inline">
                                    Jump:
                                </span>
                                {seasonBatches.map((batch) => {
                                    const isWithin =
                                        activeSeason >= batch.startSeason &&
                                        activeSeason < batch.startSeason + 10
                                    return (
                                        <button
                                            key={batch.label}
                                            type="button"
                                            onClick={() => setActiveSeason(batch.startSeason)}
                                            className={cn(
                                                "px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all",
                                                isWithin
                                                    ? "bg-[#9165FF]/25 text-[#B69AFF] border border-[#9165FF]/40 shadow-[0_0_8px_rgba(145,101,255,0.25)]"
                                                    : "bg-[#171C2C] border border-white/[0.06] text-[#929BB0] hover:text-[#F7F7FC] hover:bg-[#1F2538]",
                                            )}
                                        >
                                            {batch.label}
                                        </button>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-[11px] text-[#929BB0]">
                                Showing Season <strong>{activeSeason}</strong> of <strong>{mainSeasons.length}</strong>
                            </div>
                        )}

                        {/* Mode Toggle: Scrollable Row vs. Wrap All (Grid) */}
                        {mainSeasons.length > 10 && (
                            <button
                                type="button"
                                onClick={() =>
                                    setSeasonBarLayout((prev) => (prev === "row" ? "wrap" : "row"))
                                }
                                className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#171C2C] border border-white/[0.08] hover:border-[#9165FF]/40 text-[#B69AFF] hover:text-white transition-all"
                            >
                                <Layers className="w-3 h-3" />
                                <span>
                                    {seasonBarLayout === "row"
                                        ? `Show All (${mainSeasons.length} Seasons)`
                                        : "Compact Scroll Bar"}
                                </span>
                            </button>
                        )}
                    </div>

                    {/* Season Bar View 1: Scrollable Row with Flanking Buttons & Wheel Support */}
                    {seasonBarLayout === "row" ? (
                        <div className="flex items-center gap-2">
                            {/* Left Scroll Arrow Button */}
                            <button
                                type="button"
                                onClick={() => scrollSeasonBar("left")}
                                disabled={!canScrollSeasonLeft}
                                aria-label="Scroll seasons left"
                                className="shrink-0 w-8 h-8 rounded-xl bg-[#171C2C] border border-white/[0.08] hover:border-[#9165FF]/50 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#9165FF] transition-all shadow-sm"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {/* Scrollable Season Chips Track (Holds ALL seasons with wheel support & custom scrollbar) */}
                            <div
                                ref={seasonScrollRef}
                                onScroll={checkSeasonScroll}
                                onWheel={handleSeasonWheel}
                                className="flex-1 flex gap-2 overflow-x-auto pb-1 pt-0.5 scroll-smooth scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-[#9165FF]/50 scrollbar-track-transparent"
                            >
                                {mainSeasons.map((season) => {
                                    const active = season.season_number === activeSeason
                                    return (
                                        <button
                                            key={season.season_number}
                                            data-season={season.season_number}
                                            type="button"
                                            onClick={() => setActiveSeason(season.season_number)}
                                            aria-pressed={active}
                                            className={cn(
                                                "flex-none px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                                                active
                                                    ? "bg-gradient-to-r from-[#9165FF] to-[#7B46F6] text-white shadow-[0_0_15px_rgba(145,101,255,0.4)]"
                                                    : "bg-[#171C2C] border border-white/[0.08] text-[#929BB0] hover:text-[#F7F7FC] hover:bg-[#1F2538]",
                                            )}
                                        >
                                            <span>{season.name}</span>
                                            {season.episode_count > 0 && (
                                                <span className="ml-1.5 opacity-70 text-[10px]">
                                                    ({season.episode_count})
                                                </span>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Right Scroll Arrow Button */}
                            <button
                                type="button"
                                onClick={() => scrollSeasonBar("right")}
                                disabled={!canScrollSeasonRight}
                                aria-label="Scroll seasons right"
                                className="shrink-0 w-8 h-8 rounded-xl bg-[#171C2C] border border-white/[0.08] hover:border-[#9165FF]/50 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#9165FF] transition-all shadow-sm"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        /* Season Bar View 2: Wrap Grid - Displays ALL Seasons Simultaneously */
                        <div className="flex flex-wrap gap-2 pt-1">
                            {mainSeasons.map((season) => {
                                const active = season.season_number === activeSeason
                                return (
                                    <button
                                        key={season.season_number}
                                        type="button"
                                        onClick={() => setActiveSeason(season.season_number)}
                                        aria-pressed={active}
                                        className={cn(
                                            "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                                            active
                                                ? "bg-gradient-to-r from-[#9165FF] to-[#7B46F6] text-white shadow-[0_0_15px_rgba(145,101,255,0.4)]"
                                                : "bg-[#171C2C] border border-white/[0.08] text-[#929BB0] hover:text-[#F7F7FC] hover:bg-[#1F2538]",
                                        )}
                                    >
                                        <span>{season.name}</span>
                                        {season.episode_count > 0 && (
                                            <span className="ml-1.5 opacity-70 text-[10px]">
                                                ({season.episode_count})
                                            </span>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Active Season Spotlight Card (Directly displays Season Poster with Streamly logo fallback!) */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#101522] via-[#171C2C]/50 to-[#101522] border border-white/[0.08]">
                {/* Season Poster with Streamly Logo Fallback */}
                <div className="relative w-20 sm:w-24 aspect-[2/3] rounded-xl overflow-hidden bg-[#171C2C] border border-white/[0.1] shrink-0 shadow-lg">
                    <SafeImage
                        src={
                            activeSeasonMeta?.poster_path
                                ? `https://image.tmdb.org/t/p/w500${activeSeasonMeta.poster_path}`
                                : "/placeholder.svg"
                        }
                        fallbackSrc="/placeholder.svg"
                        alt={activeSeasonMeta?.name || `Season ${activeSeason}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 80px, 96px"
                    />
                </div>

                {/* Season Metadata & Quick Premiere Action */}
                <div className="flex-1 min-w-0 space-y-1.5 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#9165FF]/20 border border-[#9165FF]/30 text-[#B69AFF]">
                            Current Selection
                        </span>
                        <span className="text-xs text-[#929BB0]">
                            {episodes.length} Episodes available
                        </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#F7F7FC] tracking-tight">
                        {activeSeasonMeta?.name || `Season ${activeSeason}`}
                    </h3>

                    <p className="text-xs text-[#929BB0] line-clamp-2 max-w-2xl">
                        Stream all episodes from {activeSeasonMeta?.name || `Season ${activeSeason}`}. Select any episode card below to launch full playback.
                    </p>
                </div>

                {/* Quick Premiere Button */}
                {episodes.length > 0 && (
                    <Link
                        href={`/watch/${tvId}?type=tv&season=${activeSeason}&episode=${episodes[0]?.episode_number || 1}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#9165FF] to-[#7B46F6] hover:from-[#A27BFF] hover:to-[#8E5AFF] text-white text-xs font-semibold shadow-[0_0_15px_rgba(145,101,255,0.35)] transition-all shrink-0"
                    >
                        <PlayIcon className="w-3.5 h-3.5 fill-current" />
                        <span>Play Season</span>
                    </Link>
                )}
            </div>

            {/* Episode Search & Range Batch Navigator */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                {/* Search / Jump Input */}
                <div className="relative flex-1 max-w-sm">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#929BB0] pointer-events-none">
                        <Search className="w-3.5 h-3.5" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            setCurrentPage(1)
                        }}
                        placeholder="Search title or enter # (e.g. 142)..."
                        className="w-full bg-[#101522] text-xs text-[#F7F7FC] placeholder-[#929BB0]/70 rounded-xl pl-9 pr-3 py-2 border border-white/[0.08] focus:outline-none focus:border-[#9165FF]/60 focus:ring-1 focus:ring-[#9165FF]/50 transition-all shadow-inner"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#929BB0] hover:text-white px-1 py-0.5 rounded"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Range Batch Chips (When season has many episodes like 50–1000+) */}
                {batchRanges.length > 1 && !searchQuery && (
                    <div className="flex gap-1.5 overflow-x-auto scrollbar-hide py-0.5 max-w-md">
                        {batchRanges.map((range) => {
                            const isCurrent = safeCurrentPage === range.page
                            return (
                                <button
                                    key={range.page}
                                    type="button"
                                    onClick={() => setCurrentPage(range.page)}
                                    className={cn(
                                        "flex-none px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap",
                                        isCurrent
                                            ? "bg-[#9165FF]/20 text-[#B69AFF] border border-[#9165FF]/40 shadow-[0_0_8px_rgba(145,101,255,0.25)]"
                                            : "bg-[#101522] border border-white/[0.06] text-[#929BB0] hover:text-[#F7F7FC] hover:bg-[#171C2C]",
                                    )}
                                >
                                    {range.label}
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Episode Content Area */}
            {loading ? (
                /* Skeleton Loader */
                <div className="space-y-3 pt-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex gap-4 p-3.5 rounded-2xl bg-[#101522] border border-white/[0.06] animate-pulse"
                        >
                            <div className="w-36 sm:w-44 h-22 rounded-xl bg-white/[0.05] shrink-0" />
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-4 w-1/4 bg-white/[0.05] rounded" />
                                <div className="h-3 w-3/4 bg-white/[0.05] rounded" />
                                <div className="h-3 w-1/2 bg-white/[0.05] rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredEpisodes.length > 0 ? (
                <>
                    {/* View Mode 1: Detailed Cards View */}
                    {viewMode === "cards" ? (
                        <div className="space-y-3">
                            {paginatedEpisodes.map((episode) => {
                                const watchKey = `${tvId}_s${activeSeason}_e${episode.episode_number}`
                                const isWatched = watchedMap[watchKey]

                                return (
                                    <Link
                                        key={episode.id}
                                        href={`/watch/${tvId}?type=tv&season=${activeSeason}&episode=${episode.episode_number}`}
                                        className="group flex flex-col sm:flex-row gap-4 p-3 sm:p-3.5 rounded-2xl bg-[#101522] border border-white/[0.08] hover:border-[#9165FF]/50 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_25px_rgba(145,101,255,0.18)] hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        {/* Still Thumbnail with Streamly Logo Fallback */}
                                        <div className="relative w-full sm:w-48 h-28 sm:h-26 flex-none rounded-xl overflow-hidden bg-[#171C2C] border border-white/[0.06]">
                                            <SafeImage
                                                src={
                                                    episode.still_path
                                                        ? `https://image.tmdb.org/t/p/w500${episode.still_path}`
                                                        : "/placeholder-landscape.svg"
                                                }
                                                fallbackSrc="/placeholder-landscape.svg"
                                                alt={episode.name || `Episode ${episode.episode_number}`}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 640px) 100vw, 192px"
                                            />

                                            {/* Centered Play Button */}
                                            <div className="absolute inset-0 m-auto w-9 h-9 rounded-full bg-[#9165FF] text-white flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 shadow-[0_0_15px_rgba(145,101,255,0.7)]">
                                                <PlayIcon className="w-3.5 h-3.5 ml-0.5 fill-current" />
                                            </div>

                                            {/* Watched State Indicator */}
                                            {isWatched && (
                                                <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/90 text-white text-[10px] font-bold backdrop-blur-md">
                                                    <Check className="w-3 h-3" />
                                                    <span>Watched</span>
                                                </div>
                                            )}

                                            {/* Duration Badge */}
                                            {(episode as any).runtime && (
                                                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium backdrop-blur-md border border-white/10">
                                                    {(episode as any).runtime}m
                                                </div>
                                            )}
                                        </div>

                                        {/* Episode Info */}
                                        <div className="flex-1 min-w-0 space-y-1.5 py-0.5">
                                            <div className="flex items-center gap-2 flex-wrap text-[11px]">
                                                <span className="font-bold tracking-wider text-[#B69AFF] uppercase px-2 py-0.5 rounded-md bg-[#9165FF]/15 border border-[#9165FF]/20">
                                                    Episode {episode.episode_number}
                                                </span>

                                                {episode.vote_average > 0 && (
                                                    <span className="inline-flex items-center gap-1 font-semibold text-amber-400">
                                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                        {episode.vote_average.toFixed(1)}
                                                    </span>
                                                )}

                                                {episode.air_date && (
                                                    <span className="inline-flex items-center gap-1 text-[#929BB0]">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(episode.air_date).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        })}
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-sm sm:text-base font-bold text-[#F7F7FC] truncate group-hover:text-[#B69AFF] transition-colors">
                                                {episode.name}
                                            </h3>

                                            <p className="text-xs text-[#929BB0] line-clamp-2 leading-relaxed">
                                                {episode.overview || "No synopsis available for this episode."}
                                            </p>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    ) : (
                        /* View Mode 2: Compact Number Tile Grid (Handles 100s/1000s of episodes seamlessly!) */
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-2 sm:gap-2.5">
                            {paginatedEpisodes.map((episode) => {
                                const watchKey = `${tvId}_s${activeSeason}_e${episode.episode_number}`
                                const isWatched = watchedMap[watchKey]

                                return (
                                    <Link
                                        key={episode.id}
                                        href={`/watch/${tvId}?type=tv&season=${activeSeason}&episode=${episode.episode_number}`}
                                        title={`Ep ${episode.episode_number}: ${episode.name}`}
                                        className="group relative flex flex-col items-center justify-center p-3 rounded-xl bg-[#101522] border border-white/[0.08] hover:border-[#9165FF]/60 hover:bg-[#171C2C] shadow-sm hover:shadow-[0_0_15px_rgba(145,101,255,0.25)] transition-all duration-200"
                                    >
                                        <div className="text-xs sm:text-sm font-bold text-[#F7F7FC] group-hover:text-[#B69AFF] transition-colors">
                                            Ep {episode.episode_number}
                                        </div>

                                        <div className="text-[10px] text-[#929BB0] truncate max-w-full text-center mt-0.5">
                                            {episode.name ? episode.name.slice(0, 14) : `Ep ${episode.episode_number}`}
                                        </div>

                                        {isWatched && (
                                            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    )}

                    {/* Pagination Bar */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/[0.06]">
                            <span className="text-xs text-[#929BB0]">
                                Page <strong className="text-white">{safeCurrentPage}</strong> of{" "}
                                <strong className="text-white">{totalPages}</strong> ({filteredEpisodes.length}{" "}
                                episodes total)
                            </span>

                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                    disabled={safeCurrentPage <= 1}
                                    className="px-3 py-1.5 rounded-xl bg-[#101522] border border-white/[0.08] text-xs font-semibold text-[#F7F7FC] hover:bg-[#171C2C] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                    <span>Previous</span>
                                </button>

                                {/* Page Number Jumps */}
                                <div className="hidden sm:flex items-center gap-1">
                                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                                        let pageNum = idx + 1
                                        if (totalPages > 5 && safeCurrentPage > 3) {
                                            pageNum = safeCurrentPage - 2 + idx
                                            if (pageNum > totalPages) pageNum = totalPages - 4 + idx
                                        }

                                        const isActive = pageNum === safeCurrentPage
                                        return (
                                            <button
                                                key={pageNum}
                                                type="button"
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={cn(
                                                    "w-8 h-8 rounded-xl text-xs font-semibold transition-all",
                                                    isActive
                                                        ? "bg-[#9165FF] text-white shadow-[0_0_10px_rgba(145,101,255,0.4)]"
                                                        : "bg-[#101522] text-[#929BB0] hover:text-white hover:bg-[#171C2C] border border-white/[0.06]",
                                                )}
                                            >
                                                {pageNum}
                                            </button>
                                        )
                                    })}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                    disabled={safeCurrentPage >= totalPages}
                                    className="px-3 py-1.5 rounded-xl bg-[#101522] border border-white/[0.08] text-xs font-semibold text-[#F7F7FC] hover:bg-[#171C2C] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                                >
                                    <span>Next</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="glass-card rounded-3xl p-10 text-center space-y-3">
                    <p className="text-sm font-semibold text-[#F7F7FC]">
                        {searchQuery
                            ? `No episodes matched "${searchQuery}".`
                            : "No episodes found for this season."}
                    </p>
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="text-xs text-[#B69AFF] underline"
                        >
                            Reset Search
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
