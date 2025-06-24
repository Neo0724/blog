import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Home page is set to /post/all-posts
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/post/all-posts", request.url));
  }

  // Retrieve token from cookies
  let access_token = request.cookies.get("access_token")?.value;
  let refresh_token = request.cookies.get("refresh_token")?.value;

  // User is not signed in
  if (!refresh_token && !access_token) {
    if (request.nextUrl.pathname.startsWith("/post/favourite-post")) {
      return NextResponse.redirect(
        new URL("/sign-in?redirectUrl=post/favourite-post", request.url)
      );
    } else if (request.nextUrl.pathname.startsWith("/user")) {
      return NextResponse.redirect(
        new URL("/sign-in?redirectUrl=user", request.url)
      );
    } else {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }
}

export const config = {
  matcher: ["/post/favourite-post/:userId*", "/user/:userId*", "/"],
};
