import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { CookieKeys } from "./config/CookieKeys";

export async function middleware(request: NextRequest) {
  try {
    const session = (await cookies()).get(CookieKeys.COOKIE_KEY)?.value;
    let isSessionValid = false;

    const currentPath = request.nextUrl.pathname;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    if (session) {
      const payload = (await jwtVerify(session, secret)).payload;
      isSessionValid = !!payload;
    }

    const onlyPublicRoutes = ["/register", "/login"];

    if (!isSessionValid && !onlyPublicRoutes.includes(currentPath)) {
      const redirectUrl = new URL("/pages/login", request.url);
      redirectUrl.searchParams.set("redirect_to", currentPath);
      return NextResponse.redirect(redirectUrl);
    }

    if (isSessionValid && onlyPublicRoutes.includes(currentPath)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/pages/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:paths*", "/register/:paths*", "/login/:paths*"],
};
