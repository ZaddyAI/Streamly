import { Header } from "@/components/header"
import { searchMulti } from "@/lib/tmdb"
import { MovieCard } from "@/components/movie-card"
import { notFound } from "next/navigation"

interface SearchPageProps {
    searchParams: {
        q?: string
    }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const query = searchParams.q

    if (!query) {
        notFound()
    }

    const results = await searchMulti(query)

    return (
        <div className="min-h-screen">
            <Header />

            <div className="container mx-auto px-4 pt-24 pb-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Search Results for &quot;{query}&quot;</h1>
                <p className="text-muted-foreground mb-8">
                    Found {results.length} {results.length === 1 ? "result" : "results"}
                </p>

                {results.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No results found. Try a different search term.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
