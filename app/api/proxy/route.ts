import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      method: "HEAD",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    // Return status without the actual content
    return NextResponse.json({
      status: response.status,
      ok: response.ok,
      url,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch",
        ok: false,
        url,
      },
      { status: 500 }
    );
  }
}
