"use client"

import { Play } from "@/components/icons"
import { useState } from "react"
import { TrailerModal } from "./trailer-modal"

interface TrailerButtonProps {
    videoKey: string
    title: string
}

export function TrailerButton({ videoKey, title }: TrailerButtonProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                type="button"
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#101522] hover:bg-[#171C2C] text-[#F7F7FC] border border-white/[0.1] hover:border-[#9165FF]/40 text-sm font-medium transition-all shadow-[0_4px_15px_rgba(0,0,0,0.4)]"
                onClick={() => setIsOpen(true)}
            >
                <Play className="h-4 w-4 fill-current text-[#B69AFF]" />
                <span>Watch Trailer</span>
            </button>
            <TrailerModal isOpen={isOpen} onClose={() => setIsOpen(false)} videoKey={videoKey} title={title} />
        </>
    )
}
