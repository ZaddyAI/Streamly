"use client"

import Link from "next/link"
import { Play, Plus, Check } from "@/components/icons"
import { useWatchlist } from "@/hooks/use-watchlist"
import { useContinueWatching } from "@/hooks/use-continue-watching"
import { TrailerButton } from "@/components/trailer-buttons"

interface DetailsActionsProps {
    id: number
    title: string
    poster_path: string | null
    backdrop_path: string | null
    vote_average: number
    release_date?: string
    type?: "movie" | "tv"
    trailerKey?: string
    firstSeasonNumber?: number
}

export function DetailsActions({
    id,
    title,
    poster_path,
    backdrop_path,
    vote_average,
    release_date,
    type = "movie",
    trailerKey,
    firstSeasonNumber = 1,
}: DetailsActionsProps) {
    const { isInWatchlist, toggleWatchlist } = useWatchlist()
    const { items: continueItems } = useContinueWatching()
    const inList = isInWatchlist(id)

    // Resume from the last watched episode if we have one saved
    const resumeEntry = continueItems.find(
        (item) => item.id === id && item.type === type,
    )
    const canResume =
        type === "tv" && Boolean(resumeEntry?.season && resumeEntry?.episode)

    const watchUrl =
        type === "tv"
            ? canResume && resumeEntry?.season && resumeEntry?.episode
                ? `/watch/${id}?type=tv&season=${resumeEntry.season}&episode=${resumeEntry.episode}`
                : `/watch/${id}?type=tv&season=${firstSeasonNumber}&episode=1`
            : `/watch/${id}`

    const watchLabel =
        canResume && resumeEntry?.season && resumeEntry?.episode
            ? `Resume S${resumeEntry.season} E${resumeEntry.episode}`
            : "Watch Now"

    const handleToggle = () => {
        toggleWatchlist({
            id,
            title,
            poster_path,
            backdrop_path,
            vote_average,
            release_date,
            media_type: type,
        })
    }

    return (
        <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Primary Watch Now Button */}
            <Link
                href={watchUrl}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#9165FF] to-[#7B46F6] hover:from-[#A27BFF] hover:to-[#8E5AFF] text-white font-semibold text-sm shadow-[0_0_24px_rgba(145,101,255,0.4)] hover:shadow-[0_0_32px_rgba(145,101,255,0.6)] transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
                <Play className="w-4 h-4 fill-current" />
                <span>{watchLabel}</span>
            </Link>

            {/* Interactive Add to My List Toggle */}
            <button
                type="button"
                onClick={handleToggle}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#101522] hover:bg-[#171C2C] text-[#F7F7FC] border border-white/[0.1] hover:border-[#9165FF]/40 text-sm font-medium transition-all"
            >
                {inList ? (
                    <>
                        <Check className="w-4 h-4 text-[#B69AFF]" />
                        <span>In My List</span>
                    </>
                ) : (
                    <>
                        <Plus className="w-4 h-4" />
                        <span>Add to My List</span>
                    </>
                )}
            </button>

            {/* Watch Trailer Modal Trigger */}
            {trailerKey && <TrailerButton videoKey={trailerKey} title={`${title} - Trailer`} />}
        </div>
    )
}
