import { NextResponse } from "next/server";

export function GET(req: Request) {
  const key = process.env.INDEXNOW_KEY;
  const asked = new URL(req.url).searchParams.get("key");
  if (!key || asked !== key) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(key, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
