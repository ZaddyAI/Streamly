import { Header } from "@/components/header"
import { getTrendingTVShows, getPopularTVShows, getTopRatedTVShows } from "@/lib/tmdb"
import { MovieRow } from "@/components/movie-row"

export default async function TVShowsPage() {
    const [trending, popular, topRated] = await Promise.all([getTrendingTVShows(), getPopularTVShows(), getTopRatedTVShows()])

    return (
        <div className="min-h-screen">
            <Header />

            <div className="container mx-auto px-4 pt-24 pb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-8">TV Shows</h1>

                <div className="space-y-8 md:space-y-12">
                    <MovieRow
                        title="Trending TV Shows"
                        movies={trending.map((show: any) => ({ ...show, title: show.name, release_date: show.first_air_date }))}
                        type="tv"
                    />
                    <MovieRow
                        title="Popular TV Shows"
                        movies={popular.map((show: any) => ({ ...show, title: show.name, release_date: show.first_air_date }))}
                        type="tv"
                    />
                    <MovieRow
                        title="Top Rated TV Shows"
                        movies={topRated.map((show: any) => ({ ...show, title: show.name, release_date: show.first_air_date }))}
                        type="tv"
                    />
                </div>
            </div>
        </div>
    )
}
