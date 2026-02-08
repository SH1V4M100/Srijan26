import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isAdminLogin = nextUrl.pathname.startsWith("/admin/login");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");

  if (isAdminRoute && !isAdminLogin) {
    if (!isLoggedIn) {
      const url = new URL("/admin/login", nextUrl);
      url.searchParams.set("redirect", nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    if (req.auth?.user?.role !== "ADMIN" && req.auth?.user?.role !== "SUPERADMIN") {
      return NextResponse.redirect(new URL("/admin/login", nextUrl));
    }
  }

  if (isDashboardRoute && !isLoggedIn) {
    const url = new URL("/signin", nextUrl);
    url.searchParams.set("redirect", nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
