// Continue Watching persistence (localStorage)
// Stores the latest watched movie/episode per title, including how far the
// user got (progress/currentTime/duration) and the metadata needed to render
// the Continue Watching rail (title, poster, backdrop).

export interface ContinueWatchingEntry {
    id: number
    type: "movie" | "tv"
    title: string
    poster_path: string | null
    backdrop_path: string | null
    season?: number
    episode?: number
    progress: number // 0 to 100
    currentTime: number // seconds watched
    duration: number // total seconds (0 when unknown)
    updatedAt: number // timestamp of last watch session
}

export type ContinueWatchingUpdate = {
    id: number
    type: "movie" | "tv"
    title: string
    poster_path?: string | null
    backdrop_path?: string | null
    season?: number
    episode?: number
    currentTime?: number
    duration?: number
    progress?: number
}

const STORAGE_KEY = "streamly_continue_watching"
export const CONTINUE_WATCHING_EVENT = "streamly_continue_watching_updated"
const MAX_ENTRIES = 20

function entryKey(type: string, id: number) {
    return `${type}-${id}`
}

function toFiniteNumber(value: unknown, fallback = 0): number {
    const num = Number(value)
    return Number.isFinite(num) ? num : fallback
}

function clampPercent(value: number): number {
    return Math.min(100, Math.max(0, Math.round(value)))
}

function sanitizeEntry(value: unknown): ContinueWatchingEntry | null {
    if (!value || typeof value !== "object") return null
    const raw = value as Record<string, unknown>

    const id = toFiniteNumber(raw.id, 0)
    if (id <= 0) return null

    const type: "movie" | "tv" = raw.type === "tv" ? "tv" : "movie"
    const duration = Math.max(toFiniteNumber(raw.duration), 0)
    let currentTime = Math.max(toFiniteNumber(raw.currentTime), 0)
    if (duration > 0) currentTime = Math.min(currentTime, duration)

    const season =
        type === "tv" && raw.season !== undefined && raw.season !== null
            ? toFiniteNumber(raw.season, 0) || undefined
            : undefined
    const episode =
        type === "tv" && raw.episode !== undefined && raw.episode !== null
            ? toFiniteNumber(raw.episode, 0) || undefined
            : undefined

    return {
        id,
        type,
        title: typeof raw.title === "string" && raw.title ? raw.title : "Untitled",
        poster_path: typeof raw.poster_path === "string" ? raw.poster_path : null,
        backdrop_path: typeof raw.backdrop_path === "string" ? raw.backdrop_path : null,
        season,
        episode,
        progress:
            duration > 0
                ? clampPercent((currentTime / duration) * 100)
                : clampPercent(toFiniteNumber(raw.progress)),
        currentTime,
        duration,
        updatedAt: Math.max(toFiniteNumber(raw.updatedAt), 0),
    }
}

export function getContinueWatching(): ContinueWatchingEntry[] {
    if (typeof window === "undefined") return []
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw)
        if (!Array.isArray(parsed)) return []
        return parsed
            .map(sanitizeEntry)
            .filter((entry): entry is ContinueWatchingEntry => entry !== null)
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .slice(0, MAX_ENTRIES)
    } catch {
        return []
    }
}

function persist(items: ContinueWatchingEntry[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
        window.dispatchEvent(new Event(CONTINUE_WATCHING_EVENT))
    } catch {
        // Ignore quota/serialization failures
    }
}

/**
 * Insert or update the Continue Watching entry for a movie/TV show.
 * - Movies keep a single entry per id.
 * - TV shows keep a single entry per show, tracking the latest watched episode.
 * Re-saving the same episode keeps the furthest position watched.
 */
export function upsertContinueWatchingEntry(update: ContinueWatchingUpdate): void {
    if (typeof window === "undefined") return
    if (!update.id || !update.title) return

    const items = getContinueWatching()
    const key = entryKey(update.type, update.id)
    const existingIndex = items.findIndex((item) => entryKey(item.type, item.id) === key)
    const existing = existingIndex >= 0 ? items[existingIndex] : null

    // Consider it the same watch session when it's a movie or the same episode
    const isSameSession =
        !existing ||
        update.type === "movie" ||
        ((update.season === undefined || update.season === existing.season) &&
            (update.episode === undefined || update.episode === existing.episode))

    const updateCurrentTime = Math.max(toFiniteNumber(update.currentTime), 0)
    const updateDuration = Math.max(toFiniteNumber(update.duration), 0)

    let currentTime: number
    let duration: number
    if (isSameSession && existing) {
        // Keep the furthest position reached in this session
        currentTime = Math.max(existing.currentTime, updateCurrentTime)
        duration = updateDuration > 0 ? updateDuration : existing.duration
    } else {
        currentTime = updateCurrentTime
        duration = updateDuration
    }
    if (duration > 0) currentTime = Math.min(currentTime, duration)

    const progress =
        duration > 0
            ? clampPercent((currentTime / duration) * 100)
            : clampPercent(toFiniteNumber(update.progress))

    const entry: ContinueWatchingEntry = {
        id: update.id,
        type: update.type,
        title: update.title || existing?.title || "Untitled",
        poster_path: update.poster_path ?? existing?.poster_path ?? null,
        backdrop_path: update.backdrop_path ?? existing?.backdrop_path ?? null,
        season: update.type === "tv" ? update.season ?? existing?.season : undefined,
        episode: update.type === "tv" ? update.episode ?? existing?.episode : undefined,
        progress,
        currentTime,
        duration,
        updatedAt: Date.now(),
    }

    const next = items.filter((_, index) => index !== existingIndex)
    next.push(entry)
    next.sort((a, b) => b.updatedAt - a.updatedAt)
    persist(next.slice(0, MAX_ENTRIES))
}

export function removeContinueWatchingEntry(type: "movie" | "tv", id: number): void {
    if (typeof window === "undefined") return
    const key = entryKey(type, id)
    const next = getContinueWatching().filter((item) => entryKey(item.type, item.id) !== key)
    persist(next)
}

/** Format remaining watch time, e.g. "1h 10m left" / "32m left" / "Resume". */
export function formatRemainingTime(currentTime: number, duration: number): string {
    if (!Number.isFinite(duration) || duration <= 0) return "Resume"
    const remaining = Math.max(duration - currentTime, 0)
    if (remaining < 60) return "Almost done"
    const hours = Math.floor(remaining / 3600)
    const minutes = Math.round((remaining % 3600) / 60)
    if (hours > 0) return `${hours}h ${minutes}m left`
    return `${minutes}m left`
}
