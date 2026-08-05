// Server-side proxy for widget token refresh.

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Whitelist allowed fields to prevent injection of unexpected properties
  const { client_id, token } = body;
  if (typeof client_id !== "string" || !client_id) {
    return NextResponse.json({ error: "client_id required" }, { status: 400 });
  }
  if (typeof token !== "string" || !token) {
    return NextResponse.json({ error: "token required" }, { status: 400 });
  }

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
    body: JSON.stringify({ client_id, token }),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
