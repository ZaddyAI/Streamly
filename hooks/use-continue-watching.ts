"use client"

import { useCallback, useEffect, useState } from "react"
import {
    CONTINUE_WATCHING_EVENT,
    getContinueWatching,
    type ContinueWatchingEntry,
} from "@/lib/continue-watching"

export function useContinueWatching() {
    const [items, setItems] = useState<ContinueWatchingEntry[]>([])
    const [loaded, setLoaded] = useState(false)

    const syncFromStorage = useCallback(() => {
        setItems(getContinueWatching())
        setLoaded(true)
    }, [])

    useEffect(() => {
        syncFromStorage()

        const handleUpdate = () => {
            syncFromStorage()
        }

        window.addEventListener("storage", handleUpdate)
        window.addEventListener(CONTINUE_WATCHING_EVENT, handleUpdate)

        return () => {
            window.removeEventListener("storage", handleUpdate)
            window.removeEventListener(CONTINUE_WATCHING_EVENT, handleUpdate)
        }
    }, [syncFromStorage])

    return {
        items,
        loaded,
    }
}
