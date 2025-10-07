// TMDB API configuration and helper functions

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || ""; // User will need to add this
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  original_language: string;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  popularity: number;
}

export interface TVShowDetails extends TVShow {
  genres: { id: number; name: string }[];
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
  tagline: string;
  seasons: Season[];
  episode_run_time: number[];
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  episode_number: number;
  season_number: number;
  air_date: string;
  vote_average: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

// Image URL helpers
export const getImageUrl = (
  path: string | null,
  size: "w500" | "w780" | "original" = "w500"
) => {
  if (!path) return "/posterLogoLarge.png";
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (
  path: string | null,
  size: "w780" | "w1280" | "original" = "w1280"
) => {
  if (!path) return "/posterLogoLarge.png";
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

// API fetch helper
async function tmdbFetch<T>(endpoint: string): Promise<T> {
  const url = `${TMDB_BASE_URL}${endpoint}${
    endpoint.includes("?") ? "&" : "?"
  }api_key=${TMDB_API_KEY}`;
  const response = await fetch(url, { next: { revalidate: 3600 } });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.statusText}`);
  }

  return response.json();
}

// Fetch trending movies
export async function getTrendingMovies(
  timeWindow: "day" | "week" = "week"
): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>(
    `/trending/movie/${timeWindow}`
  );
  return data.results;
}

// Fetch popular movies
export async function getPopularMovies(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>("/movie/popular");
  return data.results;
}

// Fetch top rated movies
export async function getTopRatedMovies(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>("/movie/top_rated");
  return data.results;
}

// Fetch now playing movies
export async function getNowPlayingMovies(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>("/movie/now_playing");
  return data.results;
}

// Fetch upcoming movies
export async function getUpcomingMovies(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>("/movie/upcoming");
  return data.results;
}

// Fetch movie details
export async function getMovieDetails(id: number): Promise<MovieDetails> {
  return tmdbFetch<MovieDetails>(`/movie/${id}`);
}

// Fetch movies by genre
export async function getMoviesByGenre(genreId: number): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>(
    `/discover/movie?with_genres=${genreId}`
  );
  return data.results;
}

// Fetch movie genres
export async function getMovieGenres(): Promise<Genre[]> {
  const data = await tmdbFetch<{ genres: Genre[] }>("/genre/movie/list");
  return data.genres;
}

// Search movies
export async function searchMovies(query: string): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>(
    `/search/movie?query=${encodeURIComponent(query)}`
  );
  return data.results;
}

// Fetch similar movies
export async function getSimilarMovies(id: number): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>(`/movie/${id}/similar`);
  return data.results;
}

export async function getTrendingTVShows(
  timeWindow: "day" | "week" = "week"
): Promise<TVShow[]> {
  const data = await tmdbFetch<{ results: TVShow[] }>(
    `/trending/tv/${timeWindow}`
  );
  return data.results;
}

export async function getPopularTVShows(): Promise<TVShow[]> {
  const data = await tmdbFetch<{ results: TVShow[] }>("/tv/popular");
  return data.results;
}

export async function getTopRatedTVShows(): Promise<TVShow[]>{
    const data = await tmdbFetch<{ results: TVShow[] }>("/tv/top_rated");
    return data.results;
}

export async function getTVShowDetails(id: number): Promise<TVShowDetails> {
  return tmdbFetch<TVShowDetails>(`/tv/${id}`);
}

export async function getSeasonDetails(
  tvId: number,
  seasonNumber: number
): Promise<Season & { episodes: Episode[] }> {
  return tmdbFetch<Season & { episodes: Episode[] }>(
    `/tv/${tvId}/season/${seasonNumber}`
  );
}

export async function searchTVShows(query: string): Promise<TVShow[]> {
  const data = await tmdbFetch<{ results: TVShow[] }>(
    `/search/tv?query=${encodeURIComponent(query)}`
  );
  return data.results;
}

export async function getSimilarTVShows(id: number): Promise<TVShow[]> {
  const data = await tmdbFetch<{ results: TVShow[] }>(`/tv/${id}/similar`);
  return data.results;
}

export async function searchMulti(query: string): Promise<(Movie | TVShow)[]> {
  const data = await tmdbFetch<{ results: (Movie | TVShow)[] }>(
    `/search/multi?query=${encodeURIComponent(query)}`
  );
  return data.results.filter(
    (item: any) => item.media_type === "movie" || item.media_type === "tv"
  );
}

// Fetch movie videos/trailers
export async function getMovieVideos(id: number): Promise<Video[]> {
  const data = await tmdbFetch<{ results: Video[] }>(`/movie/${id}/videos`);
  return data.results.filter((video) => video.site === "YouTube");
}

// Fetch TV show videos/trailers
export async function getTVShowVideos(id: number): Promise<Video[]> {
  const data = await tmdbFetch<{ results: Video[] }>(`/tv/${id}/videos`);
  return data.results.filter((video) => video.site === "YouTube");
}
