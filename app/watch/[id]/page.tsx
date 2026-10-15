"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import {
    ArrowLeft,
    Server,
    Monitor,
    Loader2,
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight,
    SkipBack,
    SkipForward,
    Star,
    Tv,
    Film,
    Layers,
} from "@/components/icons"
import Link from "next/link"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSeasonDetails, getTVShowDetails, getMovieDetails, getImageUrl } from "@/lib/tmdb"
import type { Episode, TVShowDetails, Movie } from "@/lib/tmdb"
import { cn } from "@/lib/utils"
import { upsertContinueWatchingEntry } from "@/lib/continue-watching"
import { SafeImage } from "@/components/safe-image"

interface ServerConfig {
    id: number
    name: string
    hideServerControls?: boolean
    getURL: (type: string, id: string, season?: string, episode?: string) => string
    isAvailable?: boolean
    isChecking?: boolean
}

const SERVERS: ServerConfig[] = [
    {
        id: 1,
        name: "VidFast Pro",
        hideServerControls: true,
        getURL: (type: string, id: string, season?: string, episode?: string) =>
            `https://vidfast.pro/${type === "tv" ? "tv" : "movie"}/${id}${season && episode ? `/${season}/${episode}` : ""}?server=alpha&hideServerControls=true&autoPlay=true&theme=9165FF`,
    },
    {
        id: 2,
        name: "VidKing",
        getURL: (type: string, id: string, season?: string, episode?: string) =>
            `https://www.vidking.net/embed/${type === "tv" ? "tv" : "movie"}/${id}${season && episode ? `/${season}/${episode}` : ""}`,
    },
    {
        id: 3,
        name: "StreamFlix",
        getURL: (type: string, id: string, season?: string, episode?: string) =>
            `https://watch.streamflix.one/${type === "tv" ? "tv" : "movie"}/${id}/watch?server=1${season && episode ? `&season=${season}&episode=${episode}` : ""}`,
    },
    {
        id: 4,
        name: "VidSrc To",
        getURL: (type: string, id: string, season?: string, episode?: string) =>
            `https://vidsrc.to/embed/${type === "tv" ? "tv" : "movie"}/${id}${season && episode ? `/${season}/${episode}` : ""}`,
    },
    {
        id: 5,
        name: "VidSrc XYZ",
        getURL: (type: string, id: string, season?: string, episode?: string) =>
            `https://vidsrc.xyz/embed/${type === "tv" ? "tv" : "movie"}/${id}${season && episode ? `/${season}-${episode}` : ""}`,
    },
    {
        id: 6,
        name: "VidSrc CC",
        getURL: (type: string, id: string, season?: string, episode?: string) =>
            `https://vidsrc.cc/v2/embed/${type === "tv" ? "tv" : "movie"}/${id}${season && episode ? `?s=${season}&e=${episode}` : ""}`,
    },
    {
        id: 7,
        name: "VidLink Pro",
        getURL: (type: string, id: string, season?: string, episode?: string) => {
            if (type === "tv" && season && episode) {
                return `https://vidlink.pro/tv/${id}/${season}/${episode}`
            }
            return `https://vidlink.pro/${type === "tv" ? "tv" : "movie"}/${id}`
        },
    },
    {
        id: 8,
        name: "VidSrc Me",
        getURL: (type: string, id: string, season?: string, episode?: string) =>
            `https://vidsrc.me/embed/${type === "tv" ? "tv" : "movie"}/${id}${season && episode ? `/${season}/${episode}` : ""}`,
    },
    {
        id: 9,
        name: "VidSrc Pro",
        getURL: (type: string, id: string, season?: string, episode?: string) =>
            `https://vidsrc.pro/embed/${type === "tv" ? "tv" : "movie"}/${id}${season && episode ? `/${season}/${episode}` : ""}`,
    },
    {
        id: 10,
        name: "Smashy Stream",
        getURL: (type: string, id: string, season?: string, episode?: string) =>
            `https://player.smashy.stream/${type === "tv" ? "tv" : "movie"}/${id}${season && episode ? `?s=${season}&e=${episode}` : ""}`,
    },
    {
        id: 11,
        name: "VidCore",
        getURL: (type: string, id: string, season?: string, episode?: string) =>
            type === "tv" && season && episode
                ? `https://vidcore.org/embed/tv/${id}/${season}/${episode}?theme=9165FF`
                : `https://vidcore.org/embed/movie/${id}?theme=9165FF`,
    },
]

export default function WatchPage() {
    const router = useRouter()
    const params = useParams()
    const searchParams = useSearchParams()
    const id = params.id as string
    const type = searchParams.get("type") || "movie"

    const [selectedServer, setSelectedServer] = useState<ServerConfig | null>(null)
    const [iframeKey, setIframeKey] = useState(0)
    const [availableServers, setAvailableServers] = useState<ServerConfig[]>([])
    const [checkingServers, setCheckingServers] = useState(true)

    const [currentSeason, setCurrentSeason] = useState(searchParams.get("season") || "1")
    const [currentEpisode, setCurrentEpisode] = useState(searchParams.get("episode") || "1")
    const [tvShowData, setTVShowData] = useState<TVShowDetails | null>(null)
    const [movieData, setMovieData] = useState<Movie | null>(null)
    const [episodes, setEpisodes] = useState<Episode[]>([])
    const [loading, setLoading] = useState(true)

    // Direct episode jump input
    const [jumpInput, setJumpInput] = useState("")
    const [selectedRange, setSelectedRange] = useState(0) // Index of 50-episode batch
    const [seasonBarLayout, setSeasonBarLayout] = useState<"row" | "wrap">("row")

    // Season horizontal scroll controls
    const seasonScrollRef = useRef<HTMLDivElement>(null)
    const [canScrollSeasonLeft, setCanScrollSeasonLeft] = useState(false)
    const [canScrollSeasonRight, setCanScrollSeasonRight] = useState(true)

    const checkServerAvailability = async (server: ServerConfig): Promise<boolean> => {
        try {
            const testUrl = server.getURL(
                type,
                id,
                type === "tv" ? currentSeason : undefined,
                type === "tv" ? currentEpisode : undefined,
            )

            const proxyUrl = `/api/proxy?url=${encodeURIComponent(testUrl)}`

            const response = await fetch(proxyUrl, {
                method: "HEAD",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                const getResponse = await fetch(proxyUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                return getResponse.ok
            }

            return response.ok
        } catch (error) {
            console.error(`Error checking server ${server.name}:`, error)
            return false
        }
    }

    // Check server availability
    useEffect(() => {
        const checkAllServers = async () => {
            setCheckingServers(true)
            const checkedServers: ServerConfig[] = []
            const batchSize = 3
            const serverBatches = []

            for (let i = 0; i < SERVERS.length; i += batchSize) {
                serverBatches.push(SERVERS.slice(i, i + batchSize))
            }

            for (const batch of serverBatches) {
                const promises = batch.map(async (server) => {
                    const isAvailable = await checkServerAvailability(server)
                    return { ...server, isAvailable, isChecking: false }
                })

                const results = await Promise.allSettled(promises)
                results.forEach((result) => {
                    if (result.status === "fulfilled") {
                        checkedServers.push(result.value)
                    }
                })

                await new Promise((resolve) => setTimeout(resolve, 300))
            }

            const sortedServers = checkedServers.sort((a, b) => {
                if (a.isAvailable === b.isAvailable) return a.id - b.id
                return a.isAvailable ? -1 : 1
            })

            setAvailableServers(sortedServers)
            const firstAvailable = sortedServers.find((server) => server.isAvailable) || sortedServers[0]
            setSelectedServer(firstAvailable)
            setCheckingServers(false)
        }

        checkAllServers()
    }, [id, type, currentSeason, currentEpisode])

    // Fetch media details (TV show or Movie)
    useEffect(() => {
        let cancelled = false
        const fetchData = async () => {
            setLoading(true)
            try {
                if (type === "tv") {
                    const [showData, seasonData] = await Promise.all([
                        getTVShowDetails(Number(id)),
                        getSeasonDetails(Number(id), Number(currentSeason)),
                    ])
                    if (!cancelled) {
                        setTVShowData(showData)
                        setEpisodes(seasonData.episodes || [])

                        const epNum = Number(currentEpisode)
                        if (epNum > 50) {
                            setSelectedRange(Math.floor((epNum - 1) / 50))
                        } else {
                            setSelectedRange(0)
                        }
                    }
                } else {
                    const movie = await getMovieDetails(Number(id))
                    if (!cancelled) {
                        setMovieData(movie)
                    }
                }
            } catch (error) {
                console.error("Error fetching media details:", error)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchData()
        return () => {
            cancelled = true
        }
    }, [id, type, currentSeason])

    // Save watched status to localStorage
    useEffect(() => {
        if (type === "tv" && id && currentSeason && currentEpisode) {
            try {
                const key = `${id}_s${currentSeason}_e${currentEpisode}`
                const raw = localStorage.getItem("streamly_watched_episodes")
                const parsed = raw ? JSON.parse(raw) : {}
                parsed[key] = true
                localStorage.setItem("streamly_watched_episodes", JSON.stringify(parsed))
            } catch {
                // Ignore
            }
        }
    }, [type, id, currentSeason, currentEpisode])

    useEffect(() => {
        setIframeKey((prev) => prev + 1)
    }, [selectedServer, currentSeason, currentEpisode])

    const currentURL = selectedServer?.getURL(
        type,
        id,
        type === "tv" ? currentSeason : undefined,
        type === "tv" ? currentEpisode : undefined,
    )

    // Current episode index & adjacent episodes
    const currentEpNumber = Number(currentEpisode)
    const hasPrevEpisode = currentEpNumber > 1
    const hasNextEpisode = episodes.length > 0 ? currentEpNumber < episodes.length : true

    const goToPrevEpisode = () => {
        if (hasPrevEpisode) {
            const prevEp = (currentEpNumber - 1).toString()
            setCurrentEpisode(prevEp)
            router.push(`/watch/${id}?type=tv&season=${currentSeason}&episode=${prevEp}`)
        }
    }

    const goToNextEpisode = () => {
        if (hasNextEpisode) {
            const nextEp = (currentEpNumber + 1).toString()
            setCurrentEpisode(nextEp)
            router.push(`/watch/${id}?type=tv&season=${currentSeason}&episode=${nextEp}`)
        }
    }

    const handleJumpSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const targetEp = parseInt(jumpInput.trim(), 10)
        if (!isNaN(targetEp) && targetEp >= 1) {
            const epStr = targetEp.toString()
            setCurrentEpisode(epStr)
            router.push(`/watch/${id}?type=tv&season=${currentSeason}&episode=${epStr}`)
            setJumpInput("")
        }
    }

    // Complete seasons list ensuring no seasons are omitted (fixes 14 season cutoff)
    const completeWatchSeasons = useMemo(() => {
        if (!tvShowData) return []
        const rawMap = new Map<number, any>()
        tvShowData.seasons.forEach((s) => {
            if (s.season_number > 0) rawMap.set(s.season_number, s)
        })
        const maxSeasons = Math.max(tvShowData.number_of_seasons || 0, ...Array.from(rawMap.keys()))
        const list = []
        for (let i = 1; i <= maxSeasons; i++) {
            if (rawMap.has(i)) {
                list.push(rawMap.get(i))
            } else {
                list.push({ id: i, name: `Season ${i}`, season_number: i, episode_count: 0 })
            }
        }
        return list
    }, [tvShowData])

    // Season horizontal scroll helpers
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

    const handleSeasonWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (seasonScrollRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault()
            seasonScrollRef.current.scrollLeft += e.deltaY
            checkSeasonScroll()
        }
    }

    useEffect(() => {
        checkSeasonScroll()
        if (seasonScrollRef.current) {
            const activeBtn = seasonScrollRef.current.querySelector(
                `[data-season="${currentSeason}"]`,
            ) as HTMLElement | null
            if (activeBtn) {
                activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
            }
        }
    }, [currentSeason, completeWatchSeasons, seasonBarLayout])

    // Episode chunk ranges for long-running series with 100s or 1000s of episodes
    const episodeBatches = useMemo(() => {
        if (episodes.length <= 50) return []
        const batches = []
        for (let i = 0; i < episodes.length; i += 50) {
            const start = i + 1
            const end = Math.min(i + 50, episodes.length)
            batches.push({
                index: Math.floor(i / 50),
                label: `Ep ${start}–${end}`,
                episodes: episodes.slice(i, i + 50),
            })
        }
        return batches
    }, [episodes])

    const visibleSelectEpisodes = useMemo(() => {
        if (episodeBatches.length > 0 && episodeBatches[selectedRange]) {
            return episodeBatches[selectedRange].episodes
        }
        return episodes
    }, [episodes, episodeBatches, selectedRange])

    const mediaTitle =
        type === "tv" ? tvShowData?.name : movieData?.title
    const posterPath =
        type === "tv" ? tvShowData?.poster_path : movieData?.poster_path
    const rating =
        type === "tv" ? tvShowData?.vote_average : movieData?.vote_average

    // ---- Continue Watching: persist progress + metadata ----
    const playerProgressRef = useRef({ currentTime: 0, duration: 0 })
    const saveProgressRef = useRef<(() => void) | null>(null)

    const saveWatchProgress = useCallback(() => {
        if (!id || !mediaTitle) return

        const isTV = type === "tv"
        const season = isTV ? Number(currentSeason) : undefined
        const episode = isTV ? Number(currentEpisode) : undefined

        // Estimated total runtime (seconds) as a fallback when the player
        // doesn't report a duration via postMessage
        let runtimeMinutes = 0
        if (isTV) {
            const currentEp = episodes.find(
                (e) => e.season_number === season && e.episode_number === episode,
            )
            runtimeMinutes =
                Number((currentEp as any)?.runtime) ||
                Number(tvShowData?.episode_run_time?.[0]) ||
                0
        } else {
            runtimeMinutes = Number((movieData as any)?.runtime) || 0
        }

        const player = playerProgressRef.current
        const duration = player.duration > 0 ? player.duration : runtimeMinutes * 60
        const currentTime =
            duration > 0
                ? Math.min(Math.max(player.currentTime, 0), duration)
                : Math.max(player.currentTime, 0)

        upsertContinueWatchingEntry({
            id: Number(id),
            type: isTV ? "tv" : "movie",
            title: mediaTitle,
            poster_path: posterPath,
            backdrop_path: isTV ? tvShowData?.backdrop_path : movieData?.backdrop_path,
            season,
            episode,
            currentTime,
            duration,
        })
    }, [id, type, currentSeason, currentEpisode, mediaTitle, posterPath, tvShowData, movieData, episodes])

    // Reset tracked player time whenever the loaded media changes
    // (server / season / episode switch)
    useEffect(() => {
        playerProgressRef.current = { currentTime: 0, duration: 0 }
    }, [iframeKey])

    // Save an initial entry as soon as metadata is available so the title
    // shows up in Continue Watching even if the embed reports no playback time
    useEffect(() => {
        saveProgressRef.current = saveWatchProgress
        saveWatchProgress()
    }, [saveWatchProgress])

    // Track playback position reported by embeds that support postMessage
    // (VidFast, VidKing, Smashy, VidLink...). Cross-origin iframes can't be
    // polled directly, so this is the only way to capture currentTime.
    useEffect(() => {
        let lastSavedAt = 0

        const handleMessage = (event: MessageEvent) => {
            const data = event.data
            if (!data || typeof data !== "object") return

            const msg = data as Record<string, any>
            const payload = msg.data && typeof msg.data === "object" ? msg.data : msg

            const currentTime = Number(payload.currentTime ?? payload.position ?? payload.time)
            const duration = Number(payload.duration ?? payload.totalTime ?? payload.length)
            if (!Number.isFinite(currentTime) || currentTime <= 0) return

            const player = playerProgressRef.current
            player.currentTime = currentTime
            if (Number.isFinite(duration) && duration > 0) {
                player.duration = duration
            }

            // Throttle persistence to once every 5 seconds
            const now = Date.now()
            if (now - lastSavedAt >= 5000) {
                lastSavedAt = now
                saveProgressRef.current?.()
            }
        }

        // Flush the latest position when leaving the page or backgrounding
        const handleFlush = () => saveProgressRef.current?.()

        window.addEventListener("message", handleMessage)
        window.addEventListener("pagehide", handleFlush)
        document.addEventListener("visibilitychange", handleFlush)

        return () => {
            window.removeEventListener("message", handleMessage)
            window.removeEventListener("pagehide", handleFlush)
            document.removeEventListener("visibilitychange", handleFlush)
        }
    }, [])


    return (
        <div className="flex flex-col flex-1 space-y-6">
            <div className="space-y-6 flex-1">
                {/* Header: Back Link, Media Banner & Stream Source Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#101522] border border-white/[0.08]">
                    <div className="flex items-center gap-3.5 min-w-0">
                        <Link
                            href={`/${type}/${id}`}
                            className="inline-flex items-center gap-2 text-xs font-semibold text-[#929BB0] hover:text-[#F7F7FC] transition-colors bg-[#171C2C] border border-white/[0.08] hover:border-[#9165FF]/40 px-3 py-2 rounded-xl shrink-0"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Back</span>
                        </Link>

                        {/* Media Poster Thumbnail with Streamly Logo Fallback */}
                        <div className="relative w-9 h-13 aspect-[2/3] rounded-lg overflow-hidden bg-[#171C2C] border border-white/[0.08] shrink-0">
                            <SafeImage
                                src={posterPath ? getImageUrl(posterPath, "w500") : "/placeholder.svg"}
                                fallbackSrc="/placeholder.svg"
                                alt={mediaTitle || "Streamly Media"}
                                fill
                                className="object-cover"
                                sizes="36px"
                            />
                        </div>

                        {/* Title & Metadata */}
                        <div className="min-w-0 space-y-0.5">
                            <h1 className="text-sm sm:text-base font-bold text-[#F7F7FC] truncate">
                                {mediaTitle || (type === "tv" ? "TV Show" : "Movie")}
                            </h1>
                            <div className="flex items-center gap-2 text-xs text-[#929BB0]">
                                <span className="inline-flex items-center gap-1 font-semibold text-[#B69AFF]">
                                    {type === "tv" ? <Tv className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                                    <span>{type === "tv" ? `S${currentSeason} : E${currentEpisode}` : "Movie"}</span>
                                </span>
                                {rating && rating > 0 && (
                                    <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                                        <Star className="w-3 h-3 fill-amber-400" />
                                        <span>{rating.toFixed(1)}</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {selectedServer && (
                        <div className="flex items-center gap-2 text-xs text-[#929BB0] shrink-0">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
                            <span className="hidden sm:inline">Source:</span>
                            <strong className="text-white font-medium">{selectedServer.name}</strong>
                        </div>
                    )}
                </div>

                {/* Cinematic Player Stage */}
                <div>
                    <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-[0_20px_60px_-10px_rgba(0,0,0,0.95)] border border-white/[0.1] group">
                        {loading || checkingServers || !selectedServer ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-[#05070D]">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 rounded-full border-2 border-[#9165FF] border-t-transparent animate-spin shadow-[0_0_15px_#9165FF]" />
                                    <p className="text-xs sm:text-sm text-[#929BB0] font-medium">
                                        {checkingServers ? "Connecting to streaming sources..." : "Loading media..."}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <iframe
                                key={iframeKey}
                                src={currentURL}
                                className="absolute inset-0 w-full h-full"
                                allowFullScreen
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                title={
                                    type === "tv"
                                        ? `TV Show Player - Season ${currentSeason} Episode ${currentEpisode}`
                                        : "Movie Player"
                                }
                            />
                        )}
                    </div>

                    {/* Quick Episode Navigation Bar for TV Series */}
                    {type === "tv" && (
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#101522] border border-white/[0.08]">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={goToPrevEpisode}
                                    disabled={!hasPrevEpisode}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171C2C] border border-white/[0.08] text-xs font-semibold text-[#F7F7FC] hover:border-[#9165FF]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    <SkipBack className="w-3.5 h-3.5" />
                                    <span>Prev Ep</span>
                                </button>

                                <span className="text-xs font-bold text-[#B69AFF] px-2 py-1 rounded-lg bg-[#9165FF]/15 border border-[#9165FF]/20">
                                    S{currentSeason} : E{currentEpisode}
                                </span>

                                <button
                                    type="button"
                                    onClick={goToNextEpisode}
                                    disabled={!hasNextEpisode}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171C2C] border border-white/[0.08] text-xs font-semibold text-[#F7F7FC] hover:border-[#9165FF]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    <span>Next Ep</span>
                                    <SkipForward className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Direct Jump to Episode # Input */}
                            <form onSubmit={handleJumpSubmit} className="flex items-center gap-2">
                                <label className="text-xs text-[#929BB0] hidden sm:inline">Jump to:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={jumpInput}
                                    onChange={(e) => setJumpInput(e.target.value)}
                                    placeholder="Ep #"
                                    className="w-20 bg-[#171C2C] text-xs text-center text-[#F7F7FC] placeholder-[#929BB0]/60 rounded-xl px-2 py-1.5 border border-white/[0.08] focus:outline-none focus:border-[#9165FF]/60"
                                />
                                <button
                                    type="submit"
                                    className="px-3 py-1.5 rounded-xl bg-[#9165FF] hover:bg-[#7B46F6] text-white text-xs font-semibold shadow-[0_0_10px_rgba(145,101,255,0.3)] transition-all"
                                >
                                    Go
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Season & Episode Detailed Selector (Built for all seasons 1..50+ with wheel scroll & wrap grid) */}
                    {type === "tv" && tvShowData && (
                        <div className="mt-4 p-5 rounded-2xl bg-[#101522] border border-white/[0.08] space-y-4">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <h3 className="text-xs font-bold text-[#B69AFF] uppercase tracking-wider">
                                    Browse Seasons & Episodes ({completeWatchSeasons.length} Seasons)
                                </h3>
                                {episodes.length > 0 && (
                                    <span className="text-xs text-[#929BB0]">
                                        {episodes.length} episodes in Season {currentSeason}
                                    </span>
                                )}
                            </div>

                            {/* Complete Season Chips Bar with Flanking Controls & Wrap Toggle (Fixes 14-season limit) */}
                            {completeWatchSeasons.length > 1 && (
                                <div className="space-y-2 bg-[#171C2C]/50 p-3 rounded-xl border border-white/[0.06]">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-[11px] text-[#929BB0]">
                                            Select Season:
                                        </span>
                                        {completeWatchSeasons.length > 10 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSeasonBarLayout((prev) => (prev === "row" ? "wrap" : "row"))
                                                }
                                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B69AFF] hover:text-white"
                                            >
                                                <Layers className="w-3 h-3" />
                                                <span>
                                                    {seasonBarLayout === "row"
                                                        ? `Show All (${completeWatchSeasons.length} Seasons)`
                                                        : "Row Bar"}
                                                </span>
                                            </button>
                                        )}
                                    </div>

                                    {seasonBarLayout === "row" ? (
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => scrollSeasonBar("left")}
                                                disabled={!canScrollSeasonLeft}
                                                aria-label="Scroll seasons left"
                                                className="shrink-0 w-7 h-7 rounded-lg bg-[#101522] border border-white/[0.08] text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#9165FF] transition-all"
                                            >
                                                <ChevronLeft className="w-3.5 h-3.5" />
                                            </button>

                                            <div
                                                ref={seasonScrollRef}
                                                onScroll={checkSeasonScroll}
                                                onWheel={handleSeasonWheel}
                                                className="flex-1 flex gap-1.5 overflow-x-auto pb-1 pt-0.5 scroll-smooth scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-[#9165FF]/50 scrollbar-track-transparent"
                                            >
                                                {completeWatchSeasons.map((season) => {
                                                    const active = season.season_number.toString() === currentSeason
                                                    return (
                                                        <button
                                                            key={season.season_number}
                                                            data-season={season.season_number}
                                                            type="button"
                                                            onClick={() => {
                                                                setCurrentSeason(season.season_number.toString())
                                                                setCurrentEpisode("1")
                                                                router.push(`/watch/${id}?type=tv&season=${season.season_number}&episode=1`)
                                                            }}
                                                            className={cn(
                                                                "flex-none px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                                                                active
                                                                    ? "bg-gradient-to-r from-[#9165FF] to-[#7B46F6] text-white shadow-[0_0_12px_rgba(145,101,255,0.4)]"
                                                                    : "bg-[#101522] border border-white/[0.08] text-[#929BB0] hover:text-[#F7F7FC] hover:bg-[#1F2538]",
                                                            )}
                                                        >
                                                            {season.name}
                                                        </button>
                                                    )
                                                })}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => scrollSeasonBar("right")}
                                                disabled={!canScrollSeasonRight}
                                                aria-label="Scroll seasons right"
                                                className="shrink-0 w-7 h-7 rounded-lg bg-[#101522] border border-white/[0.08] text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#9165FF] transition-all"
                                            >
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {completeWatchSeasons.map((season) => {
                                                const active = season.season_number.toString() === currentSeason
                                                return (
                                                    <button
                                                        key={season.season_number}
                                                        type="button"
                                                        onClick={() => {
                                                            setCurrentSeason(season.season_number.toString())
                                                            setCurrentEpisode("1")
                                                            router.push(`/watch/${id}?type=tv&season=${season.season_number}&episode=1`)
                                                        }}
                                                        className={cn(
                                                            "px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                                                            active
                                                                ? "bg-gradient-to-r from-[#9165FF] to-[#7B46F6] text-white shadow-[0_0_12px_rgba(145,101,255,0.4)]"
                                                                : "bg-[#101522] border border-white/[0.08] text-[#929BB0] hover:text-[#F7F7FC] hover:bg-[#1F2538]",
                                                        )}
                                                    >
                                                        {season.name}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Dropdowns for Season and Episode */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-[#929BB0] mb-1.5 block">Season Dropdown</label>
                                    <Select
                                        value={currentSeason}
                                        onValueChange={(val) => {
                                            setCurrentSeason(val)
                                            setCurrentEpisode("1")
                                            router.push(`/watch/${id}?type=tv&season=${val}&episode=1`)
                                        }}
                                    >
                                        <SelectTrigger className="w-full bg-[#171C2C] border-white/[0.08] text-white rounded-xl h-10">
                                            <SelectValue placeholder="Select season" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#101522] border-white/[0.1] text-white max-h-72">
                                            {completeWatchSeasons.map((season) => (
                                                <SelectItem
                                                    key={season.season_number}
                                                    value={season.season_number.toString()}
                                                    className="text-xs hover:bg-[#171C2C]"
                                                >
                                                    {season.name}{" "}
                                                    {season.episode_count ? `(${season.episode_count} eps)` : ""}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-xs text-[#929BB0] mb-1.5 block">Episode Dropdown</label>
                                    <Select
                                        value={currentEpisode}
                                        onValueChange={(val) => {
                                            setCurrentEpisode(val)
                                            router.push(`/watch/${id}?type=tv&season=${currentSeason}&episode=${val}`)
                                        }}
                                    >
                                        <SelectTrigger className="w-full bg-[#171C2C] border-white/[0.08] text-white rounded-xl h-10">
                                            <SelectValue placeholder="Select episode" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#101522] border-white/[0.1] text-white max-h-72">
                                            {visibleSelectEpisodes.map((episode) => (
                                                <SelectItem
                                                    key={episode.id}
                                                    value={episode.episode_number.toString()}
                                                    className="text-xs hover:bg-[#171C2C]"
                                                >
                                                    Ep {episode.episode_number}: {episode.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Batch Range Navigator for long-running shows (e.g. Anime with 500-1000+ episodes) */}
                            {episodeBatches.length > 0 && (
                                <div className="space-y-1.5 pt-2 border-t border-white/[0.04]">
                                    <div className="text-[11px] text-[#929BB0]">
                                        Filter episode list by range:
                                    </div>
                                    <div className="flex gap-1.5 overflow-x-auto scrollbar-hide py-1">
                                        {episodeBatches.map((batch) => (
                                            <button
                                                key={batch.index}
                                                type="button"
                                                onClick={() => setSelectedRange(batch.index)}
                                                className={cn(
                                                    "px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                                                    selectedRange === batch.index
                                                        ? "bg-[#9165FF] text-white shadow-[0_0_10px_rgba(145,101,255,0.4)]"
                                                        : "bg-[#171C2C] text-[#929BB0] hover:text-white border border-white/[0.06]",
                                                )}
                                            >
                                                {batch.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Streaming Sources Selector */}
                    <div className="glass-card mt-6 space-y-4 rounded-3xl p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-bold text-[#F7F7FC]">
                                <Monitor className="h-4 w-4 text-[#9165FF]" />
                                <span>Streaming Sources</span>
                                {checkingServers && (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#929BB0]" />
                                )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-[#929BB0]">
                                <div className="flex items-center gap-1">
                                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                                    <span>Active</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <XCircle className="h-3.5 w-3.5 text-rose-500" />
                                    <span>Offline</span>
                                </div>
                            </div>
                        </div>

                        {checkingServers ? (
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="w-full h-12 bg-white/[0.05] rounded-xl animate-pulse"
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                {availableServers.map((server) => {
                                    const isSelected = selectedServer?.id === server.id
                                    return (
                                        <button
                                            key={server.id}
                                            type="button"
                                            onClick={() => server.isAvailable && setSelectedServer(server)}
                                            disabled={!server.isAvailable}
                                            className={cn(
                                                "flex items-center justify-between gap-2 p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all relative",
                                                isSelected
                                                    ? "bg-gradient-to-r from-[#9165FF] to-[#7B46F6] text-white border-transparent shadow-[0_0_18px_rgba(145,101,255,0.4)]"
                                                    : server.isAvailable
                                                        ? "bg-[#101522] hover:bg-[#171C2C] text-[#F7F7FC] border-white/[0.08] hover:border-[#9165FF]/40"
                                                        : "bg-white/[0.02] text-[#929BB0]/40 border-white/[0.04] cursor-not-allowed opacity-60",
                                            )}
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <Server className="h-3.5 w-3.5 shrink-0" />
                                                <span className="truncate">{server.name}</span>
                                            </div>

                                            {server.isAvailable ? (
                                                <CheckCircle
                                                    className={cn(
                                                        "h-3.5 w-3.5 shrink-0",
                                                        isSelected ? "text-white" : "text-emerald-500",
                                                    )}
                                                />
                                            ) : (
                                                <XCircle className="h-3.5 w-3.5 shrink-0 text-rose-500/70" />
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
