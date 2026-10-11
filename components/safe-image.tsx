"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import type { ImageProps } from "next/image"

export interface SafeImageProps extends Omit<ImageProps, "src"> {
    src: string | null | undefined
    fallbackSrc?: string
}

/**
 * SafeImage displays an image with automatic fallback to Streamly logo placeholders
 * (/placeholder.svg for portrait posters, /placeholder-landscape.svg for landscape backdrops/stills).
 * It intercepts missing sources, empty paths, and 404 network errors.
 */
export function SafeImage({
    src,
    fallbackSrc = "/placeholder.svg",
    alt,
    onError,
    ...props
}: SafeImageProps) {
    const validSrc = src && typeof src === "string" && src.trim().length > 0 ? src : fallbackSrc
    const [imgSrc, setImgSrc] = useState<string>(validSrc)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        const nextSrc = src && typeof src === "string" && src.trim().length > 0 ? src : fallbackSrc
        setImgSrc(nextSrc)
        setHasError(false)
    }, [src, fallbackSrc])

    return (
        <Image
            {...props}
            src={hasError ? fallbackSrc : imgSrc}
            alt={alt || "Streamly media"}
            onError={(e) => {
                setHasError(true)
                setImgSrc(fallbackSrc)
                onError?.(e)
            }}
        />
    )
}
