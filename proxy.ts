import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

const protectedRoutes = ["/admin"];
const authRoutes = ["/auth/signin"];

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((r) => path.startsWith(r));
  const isAuthRoute = authRoutes.some((r) => path.startsWith(r));

  const sessionCookie = req.cookies.get("session")?.value;
  const session = await decrypt(sessionCookie);

  // Unauthenticated user accessing protected route → redirect to signin
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/auth/signin", req.nextUrl));
  }

  // Authenticated user accessing auth routes → redirect to dashboard
  if (isAuthRoute && session?.userId) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|.*\\.png$).*)"],
};
