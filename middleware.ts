import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  let cookie = request.cookies.get("userId");

  if (cookie?.value === "") {
    return NextResponse.redirect(new URL("/sign-up", request.url));
  }
}

export const config = {
  matcher: ["/favourite-post", "/your-posts", "/create-post"],
};
