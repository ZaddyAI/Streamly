// Fetches GitHub star/fork counts during `npm run build` and writes them to
// public/github-stats.json, which the footer serves as a static file.
//
// Why build time? The original site used /api/github-stats to keep GITHUB_TOKEN
// server-side. A static host has no server at runtime, and putting the token in
// the browser bundle would publish it to anyone who opens devtools — so we do
// the authenticated call here instead, on your own machine, before exporting.
//
// The token is read from .env / .env.local and never written to any output.
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { join } from "node:path"

const REPO = "ZaddyAI/streamly"
const OUTPUT = join(process.cwd(), "public", "github-stats.json")
const EMPTY = { forks: null, stars: null }

const writeStats = (stats) => {
    writeFileSync(OUTPUT, `${JSON.stringify(stats, null, 2)}\n`, "utf8")
}

// Next.js loads .env files itself, but this runs as a standalone `prebuild`
// process, so it has to read them on its own. Later files win, matching
// Next.js' own precedence.
const readEnvFile = (file) => {
    const path = join(process.cwd(), file)
    if (!existsSync(path)) return {}

    const values = {}
    for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/)
        if (!match) continue

        let value = match[2]
        if (
            (value.startsWith('"') && value.endsWith('"') && value.length > 1) ||
            (value.startsWith("'") && value.endsWith("'") && value.length > 1)
        ) {
            value = value.slice(1, -1)
        }
        values[match[1]] = value
    }
    return values
}

const readExistingStats = () => {
    try {
        const parsed = JSON.parse(readFileSync(OUTPUT, "utf8"))
        return typeof parsed.stars === "number" ? parsed : null
    } catch {
        return null
    }
}

const env = { ...readEnvFile(".env"), ...readEnvFile(".env.local") }
const token = (env.GITHUB_TOKEN || process.env.GITHUB_TOKEN || "").trim()

if (!token) {
    console.warn("[github-stats] GITHUB_TOKEN is not set — footer star pill will be hidden.")
    if (!readExistingStats()) writeStats(EMPTY)
    process.exit(0)
}

try {
    const response = await fetch(`https://api.github.com/repos/${REPO}`, {
        headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github+json",
            "User-Agent": "streamly-build",
        },
        signal: AbortSignal.timeout(10_000),
    })

    if (!response.ok) throw new Error(`GitHub responded ${response.status}`)

    const data = await response.json()
    writeStats({ forks: data.forks_count ?? null, stars: data.stargazers_count ?? null })
    console.log(`[github-stats] ${data.stargazers_count} stars / ${data.forks_count} forks`)
} catch (error) {
    // A footer badge must never break the build — and a transient GitHub hiccup
    // shouldn't blank counts we already have, so keep the last good numbers.
    const previous = readExistingStats()
    if (previous) {
        console.warn(`[github-stats] ${error.message} — keeping previous counts.`)
    } else {
        console.warn(`[github-stats] ${error.message} — writing empty stats.`)
        writeStats(EMPTY)
    }
}
