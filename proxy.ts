import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;

  // If the owner hasn't set credentials yet, block access rather than leaving it open.
  if (!user || !pass) {
    return new NextResponse("Admin access not configured.", { status: 503 });
  }

  const authHeader = req.headers.get("authorization");
  const expected = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");

  if (authHeader !== expected) {
    return new NextResponse("Authentication required.", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="HH Global Company Admin"' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
