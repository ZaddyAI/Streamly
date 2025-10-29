import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  const token = process.env.GITHUB_TOKEN;

  // Check if token exists
  if (!token) {
    console.error("GITHUB_TOKEN is missing!");
    return NextResponse.json(
      { forks: null, stars: null, error: "GITHUB_TOKEN missing" },
      { status: 500 }
    );
  }

  try {
    const response = await axios.get(
      "https://api.github.com/repos/ZaddyAI/streamly",
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github+json",
        },
        timeout: 5000, // optional: timeout after 5s
      }
    );

    const data = response.data;

    return NextResponse.json({
      forks: data.forks_count,
      stars: data.stargazers_count,
    });
  } catch (error: any) {
    console.error("Error fetching GitHub data:", error.message || error);

    // Optional: include GitHub status code if available
    const statusCode = error.response?.status || 500;

    return NextResponse.json(
      { forks: null, stars: null, error: error.message },
      { status: statusCode }
    );
  }
}
