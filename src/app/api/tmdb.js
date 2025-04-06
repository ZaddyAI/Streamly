import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;

// Fetching Now Playing Movies
export const fetchnowplayingMovies = async () => {
  const url = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`;

  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching now playing movies:", error);
    return [];
  }
};

// Fetching Trending ALL
export const fetchallTrending = async () => {
  const url = `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US`;

  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching trending", error);
    return [];
  }
};

// Fetching Trending Movies
export const fetchtrendingMovies = async () => {
  const url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=en-US`;

  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
};

// Fetching All Movies
export const fetchallMovies = async (page = 1) => {
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&include_adult=false&include_video=true&language=en-US&page=${page}&sort_by=popularity.desc`;

  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

// Fetching Top Rated Movies
export const fetchTopRatedMovies = async () => {
  const url = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US`;

  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching top rated  movies:", error);
    return [];
  }
};

// Fetching Popular Movies
export const fetchpopularMovies = async () => {
  const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
};

// Movie Video if available
export const fetchMovieVideos = async (movieId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching movie videos:", error);
    return [];
  }
};

// Movie Video if available
export const fetchTvVideos = async (seriesId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/tv/${seriesId}/videos?api_key=${API_KEY}&language=en-US`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching movie videos:", error);
    return [];
  }
};

// Movie Details
export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
    );
    return response.data; // Return the full data object
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null; // Return null in case of error
  }
};

// Fetching All TV
export const fetchallTVs = async (page = 1) => {
  const url = `${BASE_URL}/trending/tv/week?api_key=${API_KEY}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}`;

  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

// Fetching Trending TV
export const fetchtrendingTVs = async () => {
  const url = `${BASE_URL}/trending/tv/week?api_key=${API_KEY}&language=en-US`;

  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching trending TV:", error);
    return [];
  }
};


// Fetching TopRated TV
export const fetchtopRatedTVs = async () => {
  const url = `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=en-US`;

  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching trending TV:", error);
    return [];
  }
};

// TV Details
export const fetchTvDetails = async (tvId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&language=en-US`
    );
    return response.data; // Return the full data object
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null; // Return null in case of error
  }
};

// Fetch Movie Cast or Credits
export const fetchmovieCredits = async (movieId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`
    );
    return response.data; // Return the full data object
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    return null; // Return null in case of error
  }
};

// Fetch TV Cast or Credits
export const fetchTvcredits = async (tvId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/tv/${tvId}/credits?api_key=${API_KEY}&language=en-US`
    );
    return response.data; // Return the full data object
  } catch (error) {
    console.error("Error fetching tv credits:", error);
    return null; // Return null in case of error
  }
};

// Fetch Tv Seasons Details
export const fetchTvseasons = async (tvId, seasonNumber) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}&language=en-US`
    );
    return response.data; // Return the full data object
  } catch (error) {
    console.error("Error fetching tv credits:", error);
    return null; // Return null in case of error
  }
};

// Fetch Tv Seasons Details
// export const fetchsearch = async (query, page = 1) => {
//   try {
//     const response = await axios.get(
//       `${BASE_URL}/search/multi?query=${query}&include_adult=true?api_key=${API_KEY}&language=en-US&page=${page}`
//     );
//     return response.data; // Return the full data object
//   } catch (error) {
//     console.error("Error fetching tv credits:", error);
//     return null; // Return null in case of error
//   }
// };

// Function to fetch search results for TV, movies, and multi-query
export const fetchSearch = async (query, page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/multi`, {
      params: {
        query: query,
        include_adult: false,
        api_key: API_KEY,
        language: "en-US",
        page: page,
      },
    });
    return response.data; // Return the full response data object
  } catch (error) {
    console.error("Error fetching search results:", error);
    return null; // Return null in case of error
  }
};
