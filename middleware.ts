import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { decodeToken, isTokenValid } from './app/lib/jwtDecode';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Create intl middleware
const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Run the internationalization middleware first
  const intlResponse = intlMiddleware(request);

  const { pathname } = request.nextUrl;

  // Extract language prefix (e.g., 'ar' or 'en')
  const langMatch = pathname.match(/^\/(ar|en)(\/|$)/);
  const langPrefix = langMatch ? langMatch[1] : 'ar'; // Default to 'ar'

  // Define protected routes based on language
  const routes = {
    admin: [`/${langPrefix}/dashboard/admin` ],
    instructor: [`/${langPrefix}/dashboard/instructor`],
    student: [`/${langPrefix}/dashboard/student`],
  };

  const protectedRoutes = [...routes.admin, ...routes.instructor, ...routes.student];

  // Authentication-related routes
  const isAuthRoute = pathname.startsWith(`/${langPrefix}/auth`) &&
   !pathname.startsWith(`/${langPrefix}/auth/access`)
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Get session from next-auth
  const session = await getToken({ req: request });
  const token = session?.accessToken as string;
  const isValidToken = isTokenValid(token);



  // If the token is invalid and it's not an authentication route, redirect to login
  if (!isValidToken && isProtectedRoute) {
    console.log('Invalid token detected. Redirecting to /auth/login.');
    const response = NextResponse.redirect(new URL(`/${langPrefix}/auth/login?error=invalid-token`, request.url));

    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('__Secure-next-auth.session-token');
    response.cookies.delete('next-auth.csrf-token');
    response.cookies.delete('next-auth.callback-url');
    return response;
  }

  // If no session exists and the route is protected, redirect to login
  if (!session && isProtectedRoute) {
    console.log('User not authenticated. Redirecting to /auth/login.');
    return NextResponse.redirect(new URL(`/${langPrefix}/auth/login`, request.url));
  }

  // Decode token and determine user role
  const decodedToken = isValidToken ? decodeToken(token) : null;
  const userRole = decodedToken?.role || null;

  // Redirect authenticated users from auth routes to their dashboards
  if (session && isAuthRoute) {
    return handleAuthRouteRedirection(userRole, request, langPrefix);
  }

  if (intlResponse) {
    return intlResponse;
  }

  return NextResponse.next();
}

// Function to handle redirecting authenticated users to their dashboards
function handleAuthRouteRedirection(role: string | null, request: NextRequest, langPrefix: string) {

  const redirectionMap: { [key: string]: string } = {
    ROLE_ADMIN: `/${langPrefix}/dashboard/admin`,
    ROLE_INSTRUCTOR: `/${langPrefix}/dashboard/instructor`,
    ROLE_STUDENT: `/${langPrefix}/dashboard/student`,
  };

  if (!role) {
    return NextResponse.next();
  }
  const redirectPath = redirectionMap[role];
  if (redirectPath) {
    console.log(`Authenticated user (${role}) redirected to ${redirectPath}`);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }


  return NextResponse.next();
}

// Configuration for middleware matching
export const config = {
  matcher: [
    '/', // Root route
    '/(ar|en)/:path*', // Language-prefixed routes
    '/dashboard/admin/:path*',
    '/dashboard/instructor/:path*',
    '/dashboard/student/:path*',
    '/auth/:path*',
  ],
};
