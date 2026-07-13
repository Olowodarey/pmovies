import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// POST /api/revalidate?secret=YOUR_SECRET&path=/Trending
// Clears the server-side fetch cache for a specific page.
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  const path = req.nextUrl.searchParams.get("path") ?? "/";

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  revalidatePath(path);
  return NextResponse.json({ revalidated: true, path });
}
