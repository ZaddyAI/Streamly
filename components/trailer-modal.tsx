"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface TrailerModalProps {
    isOpen: boolean
    onClose: () => void
    videoKey: string
    title: string
}

export function TrailerModal({ isOpen, onClose, videoKey, title }: TrailerModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 bg-[#05070D] border-white/[0.1] rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)]">
                <DialogHeader className="p-4 px-6 pb-2 border-b border-white/[0.06] bg-[#090D18]">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-base font-bold text-[#F7F7FC] tracking-tight">{title}</DialogTitle>
                    </div>
                </DialogHeader>
                <div className="relative w-full aspect-video bg-black">
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
