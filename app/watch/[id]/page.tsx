"use client"

import { Header } from "@/components/header"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Server } from "lucide-react"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSeasonDetails, getTVShowDetails } from "@/lib/tmdb"
import type { Episode, TVShowDetails } from "@/lib/tmdb"

const SERVERS = [
    {
        id: 1,
        name: "VidSrc Pro",
        getURL: (type: string, id: string, season?: string, episode?: string) =>
            `https://vidsrc.pro/embed/${type === "tv" ? "tv" : "movie"}/${id}${season && episode ? `/${season}/${episode}` : ""}`,
    },
    {
        id: 2,
        name: "VidSrc To",
        getURL: (type: string, id: string, season?: string, episode?: string) =>
            `https://vidsrc.to/embed/${type === "tv" ? "tv" : "movie"}/${id}${season && episode ? `/${season}/${episode}` : ""}`,
    },
    {
        id: 3,
        name: "StreamFlix",
        getURL: (type: string, id: string, season?: string, episode?: string) =>
            `https://watch.streamflix.one/${type === "tv" ? "tv" : "movie"}/${id}/watch?server=1${season && episode ? `&season=${season}&episode=${episode}` : ""}`,
    },
    {
        id: 4,
        name: "MultiEmbed",
        getURL: (type: string, id: string, season?: string, episode?: string) =>
            `https://multiembed.mov/?video_id=${id}${season && episode ? `&s=${season}&e=${episode}` : ""}`,
    },
    {
        id: 5,
        name: "Movies Club",
        getURL: (type: string, id: string, season?: string, episode?: string) =>
            `https://moviesapi.club/${type === "tv" ? "tv" : "movie"}/${id}${season && episode ? `-${season}-${episode}` : ""}`,
    },
    {
        id: 6,
        name: "VidSrc XYZ",
        getURL: (type: string, id: string, season?: string, episode?: string) =>
            `https://vidsrc.xyz/embed/${type === "tv" ? "tv" : "movie"}/${id}${season && episode ? `/${season}-${episode}` : ""}`,
    },
    {
        id: 7,
        name: "2Embed",
        getURL: (type: string, id: string, season?: string, episode?: string) =>
            `https://www.2embed.cc/embed/${type === "tv" ? "tv" : "movie"}/${id}${season && episode ? `&s=${season}&e=${episode}` : ""}`,
    },
    {
        id: 8,
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
    const [selectedServer, setSelectedServer] = useState(SERVERS[0])
    const [iframeKey, setIframeKey] = useState(0)

    const [currentSeason, setCurrentSeason] = useState(searchParams.get("season") || "1")
    const [currentEpisode, setCurrentEpisode] = useState(searchParams.get("episode") || "1")
    const [tvShowData, setTVShowData] = useState<TVShowDetails | null>(null)
    const [episodes, setEpisodes] = useState<Episode[]>([])
    const [loading, setLoading] = useState(type === "tv")

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

    const currentURL = selectedServer.getURL(
        type,
        id,
        type === "tv" ? currentSeason : undefined,
        type === "tv" ? currentEpisode : undefined,
    )

    return (
        <div className="min-h-screen bg-black">
            <Header />

            <div className="pt-16">
                {/* Back Button */}
                <div className="container mx-auto px-4 py-4">
                    <Button asChild variant="ghost" className="gap-2">
                        <Link href={`/${type}/${id}`}>
                            <ArrowLeft className="h-4 w-4" />
                            Back to Details
                        </Link>
                    </Button>
                </div>

                {/* Video Player */}
                <div className="container mx-auto px-4">
                    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                        {loading ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
                                        <SelectTrigger className="w-full">
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
                                        <SelectTrigger className="w-full">
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

                    {/* Server Selection */}
                    <div className="mt-6 space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Server className="h-4 w-4" />
                            <span>Select Server:</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {SERVERS.map((server) => (
                                <Button
                                    key={server.id}
                                    variant={selectedServer.id === server.id ? "default" : "secondary"}
                                    onClick={() => setSelectedServer(server)}
                                    className="min-w-24"
                                >
                                    {server.name}
                                </Button>
                            ))}
                        </div>

                        <p className="text-xs text-muted-foreground">
                            If the current server doesn&apos;t work, please try another server.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
