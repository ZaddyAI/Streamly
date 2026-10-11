"use client"

import { useEffect, useState, useCallback } from "react"

export interface WatchlistItem {
    id: number
    title: string
    poster_path: string | null
    backdrop_path: string | null
    vote_average: number
    release_date?: string
    media_type?: "movie" | "tv"
    addedAt?: number
}

const STORAGE_KEY = "streamly_user_watchlist"
const WATCHLIST_EVENT = "streamly_watchlist_updated"

export function useWatchlist() {
    const [items, setItems] = useState<WatchlistItem[]>([])
    const [loaded, setLoaded] = useState(false)

    const syncFromStorage = useCallback(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) {
                const parsed = JSON.parse(raw)
                if (Array.isArray(parsed)) {
                    setItems(parsed)
                }
            } else {
                setItems([])
            }
        } catch {
            setItems([])
        } finally {
            setLoaded(true)
        }
    }, [])

    useEffect(() => {
        syncFromStorage()

        const handleUpdate = () => {
            syncFromStorage()
        }

        window.addEventListener("storage", handleUpdate)
        window.addEventListener(WATCHLIST_EVENT, handleUpdate)

        return () => {
            window.removeEventListener("storage", handleUpdate)
            window.removeEventListener(WATCHLIST_EVENT, handleUpdate)
        }
    }, [syncFromStorage])

    const saveItems = (newItems: WatchlistItem[]) => {
        setItems(newItems)
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems))
            window.dispatchEvent(new Event(WATCHLIST_EVENT))
        } catch (e) {
            console.error("Failed to save watchlist to localStorage", e)
        }
    }

    const isInWatchlist = useCallback(
        (id: number) => {
            return items.some((item) => item.id === id)
        },
        [items],
    )

    const toggleWatchlist = useCallback(
        (item: Omit<WatchlistItem, "addedAt">) => {
            const exists = items.some((i) => i.id === item.id)
            if (exists) {
                const next = items.filter((i) => i.id !== item.id)
                saveItems(next)
                return false
            } else {
                const next = [{ ...item, addedAt: Date.now() }, ...items]
                saveItems(next)
                return true
            }
        },
        [items],
    )

    const removeFromWatchlist = useCallback(
        (id: number) => {
            const next = items.filter((i) => i.id !== id)
            saveItems(next)
        },
        [items],
    )

    return {
        items,
        loaded,
        isInWatchlist,
        toggleWatchlist,
        removeFromWatchlist,
        count: items.length,
    }
}
