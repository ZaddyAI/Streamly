import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.github.com/repos/ZaddyAI/streamly", {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json({
      forks: data.forks_count,
      stars: data.stargazers_count,
    });
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return NextResponse.json({ forks: null, stars: null }, { status: 500 });
  }
}
