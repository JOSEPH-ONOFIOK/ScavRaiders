import { NextResponse } from "next/server";

// ============================================================
// SETUP — Google Apps Script web app
//
// Sheet columns (add these as a header row):
//   Timestamp | Email | Faction | Social | Proof Link | Wallet | Raider ID
//
// 1. Open your Google Sheet → Extensions → Apps Script
// 2. Paste the script below and save it:
//
//   const SHEET_NAME = "Registrations";
//
//   function doPost(e) {
//     try {
//       const data = JSON.parse(e.postData.contents);
//       const ss = SpreadsheetApp.getActiveSpreadsheet();
//       const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
//       const emails = sheet.getRange("B:B").getValues().flat()
//         .filter(Boolean).map(v => v.toLowerCase());
//       if (emails.includes(data.email)) {
//         return ContentService
//           .createTextOutput(JSON.stringify({ status: "duplicate" }))
//           .setMimeType(ContentService.MimeType.JSON);
//       }
//       sheet.appendRow([
//         data.timestamp, data.email, data.faction, data.social,
//         data.proofLink, data.wallet, data.raiderId
//       ]);
//       return ContentService
//         .createTextOutput(JSON.stringify({ status: "ok" }))
//         .setMimeType(ContentService.MimeType.JSON);
//     } catch (err) {
//       return ContentService
//         .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
//         .setMimeType(ContentService.MimeType.JSON);
//     }
//   }
//
//   function doGet() {
//     const ss = SpreadsheetApp.getActiveSpreadsheet();
//     const sheet = ss.getSheetByName(SHEET_NAME);
//     const count = sheet ? Math.max(0, sheet.getLastRow() - 1) : 0;
//     return ContentService
//       .createTextOutput(JSON.stringify({ count }))
//       .setMimeType(ContentService.MimeType.JSON);
//   }
//
// 3. Deploy → New deployment → Web app
//    Execute as: Me · Who has access: Anyone
// 4. Copy the web app URL into .env.local as GOOGLE_SCRIPT_URL
// ============================================================

const rateMap = new Map();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 15 * 60 * 1000;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateMap.get(ip) ?? { count: 0, firstAt: now };
  if (now - entry.firstAt > RATE_WINDOW_MS) {
    rateMap.set(ip, { count: 1, firstAt: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  rateMap.set(ip, { ...entry, count: entry.count + 1 });
  return false;
}

function generateRaiderId() {
  return (
    "SR-" +
    String(Math.floor(1000 + Math.random() * 8999)) +
    "-" +
    Math.random().toString(36).slice(2, 6).toUpperCase()
  );
}

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid payload." }, { status: 400 });
  }

  const { email, faction, social, proofLink, wallet } = body ?? {};
  const validEmail =
    typeof email === "string" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
  if (!validEmail || !faction || !proofLink || !wallet) {
    return NextResponse.json(
      { ok: false, error: "Email, faction, proof link, and wallet are required." },
      { status: 422 }
    );
  }

  const raiderId = generateRaiderId();
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

  if (!scriptUrl) {
    // No sheet wired yet — stub mode
    console.log("[allowlist] no GOOGLE_SCRIPT_URL — signup not persisted:", { email, faction });
    return NextResponse.json({ ok: true, raiderId });
  }

  try {
    const res = await fetch(scriptUrl, {
      method: "POST",
      redirect: "follow", // Apps Script redirects on execute
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        faction,
        social: social?.trim() ?? "",
        proofLink: proofLink.trim(),
        wallet: wallet.trim(),
        raiderId,
        timestamp: new Date().toISOString(),
      }),
    });

    const text = await res.text();
    const data = JSON.parse(text);

    if (data.status === "duplicate") {
      return NextResponse.json(
        { ok: false, error: "This email is already on the list." },
        { status: 409 }
      );
    }
    if (data.status !== "ok") {
      return NextResponse.json(
        { ok: false, error: "Registration failed. Please try again." },
        { status: 500 }
      );
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, raiderId });
}
