// RESPONSIBILITY: Centralized Next.js middleware for RBAC (Role-Based Access Control) route protection.
// DATA FLOW: Request ? middleware ? reads gymsmart_user cookie ? validates role ? allow or redirect.
// Implements Frontend Rules 17 (centralized auth interception) and 63 (no router.push in components).
// Every protected route prefix is validated here � components NEVER handle auth redirects themselves.

import { NextRequest, NextResponse } from "next/server";
import { ROUTES } from "@/lib/routes";

/** The shape of the user stored in the non-HttpOnly gymsmart_user cookie. */
interface GymSmartUser {
  name: string;
  email: string;
  role: "admin" | "manager" | "trainer" | "superadmin";
  tenantId?: string;
}

/** Reads and parses the user payload from the non-HttpOnly gymsmart_user cookie. */
function getUserFromCookie(req: NextRequest): GymSmartUser | null {
  const cookieValue = req.cookies.get("gymsmart_user")?.value;
  if (!cookieValue) return null;
  try {
    const user = JSON.parse(decodeURIComponent(cookieValue)) as GymSmartUser;
    if (user && user.role) {
      user.role = user.role.toLowerCase() as any;
    }
    return user;
  } catch {
    return null;
  }
}

/** Maps a role to its canonical dashboard URL. */
function getDashboardForRole(role: GymSmartUser["role"]): string {
  switch (role) {
    case "admin": return ROUTES.ADMIN_DASHBOARD;
    case "manager": return ROUTES.MANAGER_DASHBOARD;
    case "trainer": return ROUTES.TRAINER_DASHBOARD;
    case "superadmin": return ROUTES.SUPERADMIN_DASHBOARD;
    default: return ROUTES.LOGIN;
  }
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const user = getUserFromCookie(req);

  // LOGGING FOR MACBOOK DEBUGGING
  console.log(`[MIDDLEWARE HIT] Time: ${new Date().toISOString()}`);
  console.log(`[MIDDLEWARE HIT] IP: ${req.headers.get('x-forwarded-for') || 'Unknown'} | Path: ${pathname}`);
  console.log(`[MIDDLEWARE HIT] User Cookie:`, user ? `Found (Role: ${user.role})` : 'Not Found');

  // Public routes: auth pages, landing, Next.js internals
  const isPublicRoute =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/landing") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/__nextjs") ||
    pathname.startsWith("/__turbopack") ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.png" ||
    pathname === "/opengraph.jpg";

  if (isPublicRoute) {
    // Redirect authenticated users away from /auth/login to their dashboard
    if (pathname.startsWith("/auth/login") && user) {
      return NextResponse.redirect(new URL(getDashboardForRole(user.role), req.url));
    }
    return NextResponse.next();
  }

  // Protected routes: require authentication
  if (!user) {
    const loginUrl = new URL(ROUTES.LOGIN, req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control
  const isAdminRoute = ROUTES.ADMIN_PREFIXES.some(p => pathname.startsWith(p));
  const isManagerRoute = ROUTES.MANAGER_PREFIXES.some(p => pathname.startsWith(p));
  const isTrainerRoute = ROUTES.TRAINER_PREFIXES.some(p => pathname.startsWith(p));
  const isSuperadminRoute = pathname.startsWith("/superadmin");

  if (isAdminRoute && user.role !== "admin") {
    return NextResponse.redirect(new URL(getDashboardForRole(user.role), req.url));
  }
  if (isManagerRoute && user.role !== "manager") {
    return NextResponse.redirect(new URL(getDashboardForRole(user.role), req.url));
  }
  if (isTrainerRoute && user.role !== "trainer") {
    return NextResponse.redirect(new URL(getDashboardForRole(user.role), req.url));
  }
  if (isSuperadminRoute && user.role !== "superadmin") {
    return NextResponse.redirect(new URL(getDashboardForRole(user.role), req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|__nextjs|__turbopack|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
