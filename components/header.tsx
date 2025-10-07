"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { searchMulti } from "@/lib/tmdb"
import type { Movie, TVShow } from "@/lib/tmdb"
import { getImageUrl } from "@/lib/tmdb"
import Image from "next/image"

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter()
    const [suggestions, setSuggestions] = useState<(Movie | TVShow)[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.trim().length > 1) {
                try {
                    const results = await searchMulti(searchQuery)
                    setSuggestions(results.slice(0, 5))
                    setShowSuggestions(true)
                } catch (error) {
                    console.error("[v0] Error fetching suggestions:", error)
                }
            } else {
                setSuggestions([])
                setShowSuggestions(false)
            }
        }

        const debounce = setTimeout(fetchSuggestions, 300)
        return () => clearTimeout(debounce)
    }, [searchQuery])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
            setSearchQuery("")
            setIsSearchOpen(false)
            setShowSuggestions(false)
        }
    }

    const handleSuggestionClick = (item: Movie | TVShow) => {
        const isTV = "name" in item
        const path = isTV ? `/tv/${item.id}` : `/movie/${item.id}`
        router.push(path)
        setSearchQuery("")
        setIsSearchOpen(false)
        setShowSuggestions(false)
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background via-background/95 to-transparent">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        {/* <div className="text-2xl font-bold text-primary">STREAMLY</div> */}
                        <Image src="/greenLogo.png" alt="Streamly Logo" width={50} height={50} />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                            Home
                        </Link>
                        <Link href="/movies" className="text-sm font-medium hover:text-primary transition-colors">
                            Movies
                        </Link>
                        <Link href="/tv-shows" className="text-sm font-medium hover:text-primary transition-colors">
                            TV Shows
                        </Link>
                        <Link href="/trending" className="text-sm font-medium hover:text-primary transition-colors">
                            Trending
                        </Link>
                    </div>

                    {/* Search & Mobile Menu */}
                    <div className="flex items-center gap-2">
                        {isSearchOpen ? (
                            <div ref={searchRef} className="relative">
                                <form onSubmit={handleSearch} className="flex items-center gap-2">
                                    <Input
                                        type="text"
                                        placeholder="Search movies & TV shows..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-48 md:w-64 bg-secondary border-border"
                                        autoFocus
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setIsSearchOpen(false)
                                            setShowSuggestions(false)
                                            setSearchQuery("")
                                        }}
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </form>

                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute top-full mt-2 w-full md:w-96 bg-secondary border border-border rounded-lg shadow-xl overflow-hidden z-50">
                                        {suggestions.map((item) => {
                                            const isTV = "name" in item
                                            const title = isTV ? (item as TVShow).name : (item as Movie).title
                                            const year = isTV
                                                ? new Date((item as TVShow).first_air_date).getFullYear()
                                                : new Date((item as Movie).release_date).getFullYear()

                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() => handleSuggestionClick(item)}
                                                    className="w-full flex items-center gap-3 p-3 hover:bg-background/50 transition-colors text-left"
                                                >
                                                    <div className="relative w-12 h-16 flex-shrink-0 rounded overflow-hidden bg-muted">
                                                        {item.poster_path ? (
                                                            <Image
                                                                src={getImageUrl(item.poster_path, "w500") || "/placeholder.svg"}
                                                                alt={title}
                                                                fill
                                                                className="object-cover"
                                                                sizes="48px"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                                                No Image
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium truncate">{title}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {year} • {isTV ? "TV Show" : "Movie"}
                                                        </p>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                                <Search className="h-5 w-5" />
                            </Button>
                        )}

                        {/* Mobile Menu Toggle */}
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 flex flex-col gap-4 animate-in slide-in-from-top">
                        <Link
                            href="/"
                            className="text-sm font-medium hover:text-primary transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/movies"
                            className="text-sm font-medium hover:text-primary transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Movies
                        </Link>
                        <Link
                            href="/tv-shows"
                            className="text-sm font-medium hover:text-primary transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            TV Shows
                        </Link>
                        <Link
                            href="/trending"
                            className="text-sm font-medium hover:text-primary transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Trending
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    )
}
