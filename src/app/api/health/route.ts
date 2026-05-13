import { NextResponse } from "next/server";

/**
 * Health check para monitoramento (Vercel, UptimeRobot, etc.).
 */
export function GET() {
  return NextResponse.json(
    { ok: true, service: "conecta-ae-podcast-portal" },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}
