import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  let cookie = request.cookies.get("userId");

  console.log(request.nextUrl.pathname);

  if (!cookie || cookie?.value === "") {
    if (request.nextUrl.pathname.startsWith("/favourite-post")) {
      return NextResponse.redirect(
        new URL("/sign-in?redirectUrl=favourite-post", request.url)
      );
    }
  }

  if (request.nextUrl.pathname.startsWith("/")) {
    return NextResponse.redirect(new URL("/post/all-posts", request.url));
  }
}

export const config = {
  matcher: ["/favourite-post/:userId*", "/"],
};
