"use client"

import { Header } from "@/components/header"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Server, Monitor, Loader2, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSeasonDetails, getTVShowDetails } from "@/lib/tmdb"
import type { Episode, TVShowDetails } from "@/lib/tmdb"
import { Footer } from "@/components/footer"

// Server interface with availability status
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
            `https://vidfast.pro/${type === "tv" ? "tv" : "movie"}/${id}${season && episode ? `/${season}/${episode}` : ""}?server=alpha&hideServerControls=true&autoPlay=true&theme=16A085`,
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
]

export default function WatchPage() {
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
    const [episodes, setEpisodes] = useState<Episode[]>([])
    const [loading, setLoading] = useState(type === "tv")

    // Function to check if a server is available
    const checkServerAvailability = async (server: ServerConfig): Promise<boolean> => {
        try {
            const testUrl = server.getURL(type, id, type === "tv" ? currentSeason : undefined, type === "tv" ? currentEpisode : undefined)

            // Use a proxy or CORS-friendly approach
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(testUrl)}`

            const response = await fetch(proxyUrl, {
                method: 'HEAD',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            // Some servers might block HEAD requests, so try GET if HEAD fails
            if (!response.ok) {
                const getResponse = await fetch(proxyUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                return getResponse.ok
            }

            return response.ok
        } catch (error) {
            console.error(`[v0] Error checking server ${server.name}:`, error)
            return false
        }
    }

    // Check all servers availability
    useEffect(() => {
        const checkAllServers = async () => {
            setCheckingServers(true)
            const checkedServers: ServerConfig[] = []

            // Check servers in parallel with a limit to avoid too many requests at once
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
                    if (result.status === 'fulfilled') {
                        checkedServers.push(result.value)
                    }
                })

                // Small delay between batches to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500))
            }

            // Sort servers: available first, then by ID
            const sortedServers = checkedServers.sort((a, b) => {
                if (a.isAvailable === b.isAvailable) return a.id - b.id
                return a.isAvailable ? -1 : 1
            })

            setAvailableServers(sortedServers)

            // Set the first available server as selected, or fallback to first server
            const firstAvailable = sortedServers.find(server => server.isAvailable) || sortedServers[0]
            setSelectedServer(firstAvailable)

            setCheckingServers(false)
        }

        checkAllServers()
    }, [id, type, currentSeason, currentEpisode])

    useEffect(() => {
        if (type === "tv") {
            const fetchTVData = async () => {
                try {
                    setLoading(true)
                    const [showData, seasonData] = await Promise.all([
                        getTVShowDetails(Number(id)),
                        getSeasonDetails(Number(id), Number(currentSeason)),
                    ])
                    setTVShowData(showData)
                    setEpisodes(seasonData.episodes)
                } catch (error) {
                    console.error("[v0] Error fetching TV data:", error)
                } finally {
                    setLoading(false)
                }
            }
            fetchTVData()
        }
    }, [id, type, currentSeason])

    useEffect(() => {
        setIframeKey((prev) => prev + 1)
    }, [selectedServer, currentSeason, currentEpisode])

    const currentURL = selectedServer?.getURL(
        type,
        id,
        type === "tv" ? currentSeason : undefined,
        type === "tv" ? currentEpisode : undefined,
    )

    return (
        <div className="min-h-screen bg-black flex flex-col">
            <Header />

            <div className="pt-16 flex-1">
                {/* Back Button */}
                <div className="container mx-auto px-4 py-4">
                    <Button asChild variant="ghost" className="gap-2">
                        <Link href={`/${type}/${id}`}>
                            <ArrowLeft className="h-4 w-4" />
                            Back to Details
                        </Link>
                    </Button>
                </div>

                <div className="container mx-auto px-4">
                    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-border">
                        {loading || checkingServers || !selectedServer ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-secondary/20">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                    <p className="text-sm text-muted-foreground">
                                        {checkingServers ? "Checking available servers..." : "Loading player..."}
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
                                title={type === "tv" ? `TV Show Player - S${currentSeason}E${currentEpisode}` : "Movie Player"}
                            />
                        )}
                    </div>

                    {type === "tv" && tvShowData && (
                        <div className="mt-6 space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Season Selector */}
                                <div className="flex-1">
                                    <label className="text-sm text-muted-foreground mb-2 block">Season</label>
                                    <Select value={currentSeason} onValueChange={setCurrentSeason}>
                                        <SelectTrigger className="w-full bg-secondary">
                                            <SelectValue placeholder="Select season" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tvShowData.seasons
                                                .filter((season) => season.season_number > 0)
                                                .map((season) => (
                                                    <SelectItem key={season.id} value={season.season_number.toString()}>
                                                        {season.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Episode Selector */}
                                <div className="flex-1">
                                    <label className="text-sm text-muted-foreground mb-2 block">Episode</label>
                                    <Select value={currentEpisode} onValueChange={setCurrentEpisode}>
                                        <SelectTrigger className="w-full bg-secondary">
                                            <SelectValue placeholder="Select episode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {episodes.map((episode) => (
                                                <SelectItem key={episode.id} value={episode.episode_number.toString()}>
                                                    Episode {episode.episode_number}: {episode.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 space-y-4 bg-secondary/30 rounded-xl p-6 border border-border">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <Monitor className="h-5 w-5 text-primary" />
                                <span>Available Servers</span>
                                {checkingServers && (
                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    <span>Available</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <XCircle className="h-3 w-3 text-red-500" />
                                    <span>Unavailable</span>
                                </div>
                            </div>
                        </div>

                        {checkingServers ? (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="w-full h-14 bg-secondary/50 rounded-lg animate-pulse"
                                    />
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {availableServers.map((server) => (
                                        <Button
                                            key={server.id}
                                            variant={selectedServer?.id === server.id ? "default" : "secondary"}
                                            onClick={() => server.isAvailable && setSelectedServer(server)}
                                            className="w-full gap-2 h-auto py-3 relative"
                                            disabled={!server.isAvailable}
                                        >
                                            <Server className="h-4 w-4" />
                                            <span className="text-xs sm:text-sm">{server.name}</span>
                                            {server.isAvailable ? (
                                                <CheckCircle className="h-3 w-3 text-green-500 absolute top-1 right-1" />
                                            ) : (
                                                <XCircle className="h-3 w-3 text-red-500 absolute top-1 right-1" />
                                            )}
                                        </Button>
                                    ))}
                                </div>

                                {availableServers.filter(s => s.isAvailable).length === 0 && (
                                    <div className="text-center py-4">
                                        <p className="text-red-400">No servers available for this content. Please try another movie or TV show.</p>
                                    </div>
                                )}

                                <p className="text-xs text-muted-foreground text-center pt-2">
                                    {availableServers.filter(s => s.isAvailable).length} of {availableServers.length} servers available
                                    {availableServers.filter(s => s.isAvailable).length > 0
                                        ? " - Click another server if current one doesn't work."
                                        : ""}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
