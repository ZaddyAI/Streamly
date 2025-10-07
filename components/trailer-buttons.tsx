"use client"

import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
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
            <Button variant="secondary" size="lg" className="gap-2" onClick={() => setIsOpen(true)}>
                <Play className="h-5 w-5" />
                Watch Trailer
            </Button>
            <TrailerModal isOpen={isOpen} onClose={() => setIsOpen(false)} videoKey={videoKey} title={title} />
        </>
    )
}
