// Server-side proxy for widget token refresh.

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const backendUrl = process.env.SCAVENGER_API_URL;
  if (!backendUrl) {
    return NextResponse.json(
      { error: "SCAVENGER_API_URL not configured" },
      { status: 503 },
    );
  }

  const origin = req.headers.get("origin") ?? process.env.WIDGET_ORIGIN ?? "";

  const res = await fetch(`${backendUrl}/agentic/widget/token/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
