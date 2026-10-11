import { searchMulti } from "@/lib/tmdb"
import { MovieCard } from "@/components/movie-card"
import { Search, Compass } from "@/components/icons"
import Link from "next/link"

interface SearchPageProps {
    searchParams: Promise<{
        q?: string
    }>
}

const POPULAR_GENRES = [
    { name: "Action", id: 28 },
    { name: "Sci-Fi", id: 878 },
    { name: "Comedy", id: 35 },
    { name: "Drama", id: 18 },
    { name: "Thriller", id: 53 },
    { name: "Horror", id: 27 },
    { name: "Animation", id: 16 },
    { name: "Adventure", id: 12 },
]

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q: query } = await searchParams
    let results: any[] = []

    if (query && query.trim()) {
        try {
            results = await searchMulti(query.trim())
        } catch (e) {
            console.error("Search multi failed", e)
        }
    }

    return (
        <div className="space-y-8 md:space-y-10">
            {/* Header */}
            <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#9165FF]/15 border border-[#9165FF]/30 text-[#B69AFF]">
                    <Search className="w-3.5 h-3.5" />
                    <span>Search Catalogue</span>
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#F7F7FC] tracking-tight">
                    {query ? (
                        <>
                            Results for <span className="text-[#B69AFF]">&quot;{query}&quot;</span>
                        </>
                    ) : (
                        "Discover Entertainment"
                    )}
                </h1>
                <p className="text-sm text-[#929BB0]">
                    {query
                        ? `Found ${results.length} ${results.length === 1 ? "match" : "matches"} across movies and television series.`
                        : "Search through thousands of films, series, actors, and directors."}
                </p>
            </div>

            {/* Results or Empty Discovery Hub */}
            {!query ? (
                <div className="glass-card rounded-3xl p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto my-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#9165FF] to-[#B69AFF] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(145,101,255,0.4)]">
                        <Search className="w-8 h-8 text-white" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-[#F7F7FC]">What are you in the mood for?</h2>
                        <p className="text-sm text-[#929BB0] leading-relaxed">
                            Type a movie title, TV show, or creator into the search bar at the top, or start by exploring our popular genres.
                        </p>
                    </div>

                    <div className="pt-2">
                        <div className="text-xs font-semibold text-[#929BB0] uppercase tracking-wider mb-3">
                            Popular Genres
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            {POPULAR_GENRES.map((genre) => (
                                <Link
                                    key={genre.id}
                                    href={`/genres?id=${genre.id}&name=${encodeURIComponent(genre.name)}`}
                                    className="px-4 py-2 rounded-xl text-xs font-medium bg-[#101522] hover:bg-[#171C2C] border border-white/[0.08] hover:border-[#9165FF]/40 text-[#F7F7FC] transition-all"
                                >
                                    {genre.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            ) : results.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                    {results.map((item: any) => (
                        <MovieCard
                            key={item.id}
                            movie={{
                                ...item,
                                title: item.title || item.name,
                                release_date: item.release_date || item.first_air_date,
                            }}
                            type={item.media_type || (item.title ? "movie" : "tv")}
                        />
                    ))}
                </div>
            ) : (
                <div className="glass-card rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto my-8">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mx-auto text-[#929BB0]">
                        <Search className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-[#F7F7FC]">No titles found</h2>
                    <p className="text-sm text-[#929BB0] leading-relaxed">
                        We couldn&apos;t find anything matching &quot;{query}&quot;. Try checking for typos or searching with different keywords.
                    </p>
                </div>
            )}
        </div>
    )
}
