import { NextResponse } from "next/server";

export const revalidate = 60; // cache 60 s to avoid hammering the script on every load

const TOTAL = 2500;

export async function GET() {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  if (!scriptUrl) {
    return NextResponse.json({ remaining: null, total: TOTAL });
  }

  try {
    const res = await fetch(scriptUrl, { redirect: "follow" });
    const { count } = await res.json();
    return NextResponse.json({ remaining: Math.max(0, TOTAL - count), total: TOTAL });
  } catch {
    return NextResponse.json({ remaining: null, total: TOTAL });
  }
}
