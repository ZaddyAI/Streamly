# Streamly

Welcome to **Streamly**, an ad-free streaming platform for movies and TV series! Streamly offers a seamless and enjoyable viewing experience, allowing you to watch your favorite content without interruptions.

## Features

- **Ad-Free Streaming** — Enjoy a clean, uninterrupted viewing experience with no advertisements.
- **Extensive Content Library** — Browse a wide range of movies and TV series, powered by the TMDB API.
- **Powerful Search** — Search by title across movies and TV series, with live suggestions as you type.
- **Multiple Streaming Servers** — Choose from **10 different servers** (VidFast Pro, VidKing, StreamFlix, VidSrc To / XYZ / CC / Me / Pro, VidLink Pro, and Smashy Stream) with automatic availability checks, so there's always a working source.
- **Season & Episode Browser** — Full season picker with paginated episode lists, air dates, runtimes, and stills.
- **Continue Watching** — A progress-bar rail with remaining-time estimates on the home page.
- **My List** — Save titles to a personal watchlist that persists in your browser via local storage.
- **Episode Tracking** — Mark episodes as watched and search within a season's episode list.
- **Trending & Curated Rows** — Trending, popular, top rated, now playing, and upcoming rails across home, movies, and TV pages.
- **Trailers** — Watch trailers in a modal without leaving the page.
- **Cinematic Dark UI** — A custom design system with a `#635bff` brand accent, glass cards, ambient gradients, and a fully responsive full-bleed layout.
- **Privacy & Cookie Policy Pages** — Built-in legal pages with a consent banner.

## Screenshots

Here are some images and screenshots showcasing Streamly's features:

![Streamly Homepage](./screenshots/homepage.png)
*Homepage*

![Movies](./screenshots/movies.png)
*Movies*

![TvShows](./screenshots/tv.png)
*Tv Shows*

![Details](./screenshots/details.png)
*Details*

![Movie Playback](./screenshots/player.png)
*Watch content with the option to select from multiple streaming servers.*

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router) + React 18
- **Language:** TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/), Radix UI primitives, `tailwind-merge`, `class-variance-authority`
- **Data:** [TMDB API](https://www.themoviedb.org/documentation/api) via a typed client in `lib/tmdb.ts`

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your keys:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_TMDB_API_KEY` | **Yes** | Your TMDB API v3 key. Drives all catalog data. |
| `NEXT_PUBLIC_TMDB_BASE_URL` | Yes | TMDB API base URL — `https://api.themoviedb.org/3` |
| `NEXT_PUBLIC_TMDB_IMAGE_URL` | Yes | TMDB image base URL — `https://image.tmdb.org/t/p/original` |
| `GITHUB_TOKEN` | No | Personal access token used by `/api/github-stats` to show live star and fork counts in the footer. If omitted, the stats pill hides itself gracefully. |

### 3. Run the dev server

```bash
npm run dev
```

The app starts on [http://localhost:3000](http://localhost:3000) (falling back to the next free port if 3000 is taken).

### Production build

```bash
npm run build
npm start
```

## Project Structure

```
app/
  page.tsx                  Home — hero, rails, editorial right rail
  movies/  tv-shows/        Catalog listings
  trending/  genres/        Discovery pages
  search/                   Search with live suggestions
  my-list/                  Local-storage watchlist
  movie/[id]/               Movie details
  tv/[id]/                  TV details + season/episode browser
  watch/[id]/               Player with server selection
  privacy-policy/           Legal pages
  cookies-policy/
  api/github-stats/         Live GitHub star & fork counts
  api/proxy/                Availability probe for embed servers
components/                 UI components (see below)
hooks/                      use-watchlist, use-mobile, use-toast
lib/
  tmdb.ts                   Typed TMDB client + image helpers
  constants.ts              Nav links, developer info
  utils.ts                  `cn()` class helper
public/                     Favicon and static assets
screenshots/                README screenshots
```

### Key components

| Component | Purpose |
| --- | --- |
| `site-layout.tsx` | Sticky top navbar, search, mobile menu, full-bleed shell |
| `hero-section.tsx` | Landing hero |
| `movie-row.tsx` / `movie-card.tsx` | Horizontal rails and poster cards |
| `season-episodes.tsx` | Season chips + paginated episode list |
| `continue-watching.tsx` / `right-rail.tsx` | Home page modules |
| `icons.tsx` | **Single source of truth for all icons** — brand marks, custom SVGs, and lucide re-exports |
| `footer.tsx` | Compact footer with GitHub stats, TMDB attribution, and disclaimer |
| `safe-image.tsx` | Image wrapper with graceful fallbacks |

## Routes

| Route | Description |
| --- | --- |
| `/` | Home — hero, continue watching, trending/popular/top rated rails |
| `/movies` | Movie catalog — popular, top rated, now playing, upcoming |
| `/tv-shows` | TV catalog |
| `/trending` | Trending movies and TV |
| `/genres` | Browse and filter movies by genre |
| `/search` | Search across movies and TV |
| `/my-list` | Your saved watchlist |
| `/movie/[id]` | Movie details, trailer, and similar titles |
| `/tv/[id]` | TV details with season and episode browser |
| `/watch/[id]` | Player — pick one of 10 streaming servers |

## How It Works

1. **Search for Content** — Use the search bar to find movies and TV series by title, with live suggestions as you type.
2. **Select a Server** — Choose from a list of available servers to start watching your selected content. Streamly checks availability in the background so only working servers are offered.
3. **Enjoy Ad-Free Viewing** — Stream your favorite movies and TV shows without any interruptions.

## Disclaimer

Streamly does not host, upload, or store any media files on its servers. All video streams are retrieved and embedded from third-party services. We are not responsible for the compliance, copyright, or legality of third-party hosted content.

This product uses the TMDB API but is not endorsed or certified by TMDB.

## License

This project is licensed under the [MIT License](./LICENSE) — © 2024 Gambhir Poudel.

## Contact

For any inquiries or support, please contact us at:

- **Email**: gambhir.poudel@gmail.com
- **GitHub**: [ZaddyAI/streamly](https://github.com/ZaddyAI/streamly)

---
