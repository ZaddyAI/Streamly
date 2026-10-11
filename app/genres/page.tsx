import { getMoviesByGenre, getMovieGenres } from "@/lib/tmdb"
import { MovieCard } from "@/components/movie-card"
import { Compass } from "@/components/icons"
import Link from "next/link"

const ALL_GENRES = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 27, name: "Horror" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Sci-Fi" },
    { id: 53, name: "Thriller" },
]

interface GenresPageProps {
    searchParams: Promise<{
        id?: string
        name?: string
    }>
}

export default async function GenresPage({ searchParams }: GenresPageProps) {
    const params = await searchParams
    const selectedId = params.id ? parseInt(params.id, 10) : ALL_GENRES[0].id
    const selectedGenre = ALL_GENRES.find((g) => g.id === selectedId) || ALL_GENRES[0]

    let movies: any[] = []
    try {
        movies = await getMoviesByGenre(selectedGenre.id)
    } catch (e) {
        console.error("Failed to fetch movies by genre", e)
    }

    return (
        <div className="space-y-8 md:space-y-10">
            {/* Header */}
            <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#9165FF]/15 border border-[#9165FF]/30 text-[#B69AFF]">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Explore by Category</span>
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#F7F7FC] tracking-tight">
                    Browse Genres
                </h1>
                <p className="text-sm text-[#929BB0] max-w-2xl">
                    Discover your next favorite cinema piece filtered by style, tone, and genre.
                </p>
            </div>

            {/* Genre Filter Pills */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
                {ALL_GENRES.map((genre) => {
                    const active = genre.id === selectedGenre.id
                    return (
                        <Link
                            key={genre.id}
                            href={`/genres?id=${genre.id}&name=${encodeURIComponent(genre.name)}`}
                            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${active
                                ? "bg-gradient-to-r from-[#9165FF] to-[#7B46F6] text-white shadow-[0_0_15px_rgba(145,101,255,0.4)]"
                                : "bg-[#101522] hover:bg-[#171C2C] text-[#929BB0] hover:text-[#F7F7FC] border border-white/[0.08]"
                                }`}
                        >
                            {genre.name}
                        </Link>
                    )
                })}
            </div>

            {/* Selected Genre Banner */}
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <h2 className="text-xl font-bold text-[#F7F7FC]">
                    Top {selectedGenre.name} Titles
                </h2>
                <span className="text-xs text-[#929BB0]">
                    {movies.length} titles available
                </span>
            </div>

            {/* Movies Grid */}
            {movies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} type="movie" />
                    ))}
                </div>
            ) : (
                <div className="glass-card rounded-2xl p-8 text-center text-sm text-[#929BB0]">
                    No movies found for this genre at the moment. Please try another genre above.
                </div>
            )}
        </div>
    )
}
