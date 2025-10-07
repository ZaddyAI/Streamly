"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TrailerModalProps {
    isOpen: boolean
    onClose: () => void
    videoKey: string
    title: string
}

export function TrailerModal({ isOpen, onClose, videoKey, title }: TrailerModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 bg-black border-border">
                <DialogHeader className="p-4 pb-0">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
                        {/* <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                            <X className="h-4 w-4" />
                        </Button> */}
                    </div>
                </DialogHeader>
                <div className="relative w-full aspect-video">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={title}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
