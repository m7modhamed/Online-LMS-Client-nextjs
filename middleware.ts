import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { decodeToken, isTokenValid } from './app/lib/jwtDecode';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Create intl middleware
const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest, response: NextResponse) {
  // Run the internationalization middleware first
  const intlResponse = intlMiddleware(request);

  const { pathname: pathName } = request.nextUrl;
  // Extract language prefix (e.g., 'ar' or 'en')
  const langMatch = pathName.match(/^\/(ar|en)(\/|$)/);
  const langPrefix = langMatch ? langMatch[1] : "en";

  // Ensure we don't override locale by mistake
  if (!langMatch) {
    return NextResponse.redirect(new URL(`/${langPrefix}${pathName}`, request.url));
  }

  // Define protected routes based on language
  const routes = {
    admin: [`/${langPrefix}/dashboard/admin`],
    instructor: [`/${langPrefix}/dashboard/instructor`],
    student: [`/${langPrefix}/dashboard/student`],
  };

  const protectedRoutes = [...routes.admin, ...routes.instructor, ...routes.student];
  const isAllowedRoute = !protectedRoutes.some((route) => pathName.includes(route));
  const isAccessRoute = pathName.startsWith(`/${langPrefix}/auth/access`);
  const isAuthRoute = pathName.startsWith(`/${langPrefix}/auth`) && !isAccessRoute;
  const isProtectedRoute = protectedRoutes.some((route) => pathName.startsWith(route));
  const isAdminRoute = routes.admin.some((route) => pathName.startsWith(route));
  const isInstructorRoute = routes.instructor.some((route) => pathName.startsWith(route));
  const isStudentRoute = routes.student.some((route) => pathName.startsWith(route));

  // Get session from next-auth
  const session = await getToken({ req: request });
  const token = session?.accessToken as string;
  // Decode token and determine user role
  const decodedToken = decodeToken(token);
  const userRole = decodedToken?.role || null;


  // If no session exists and the route is protected, redirect to login
  if (!session && isProtectedRoute) {
    console.log('User not authenticated. Redirecting to /auth/login.');
    return NextResponse.redirect(new URL(`/${langPrefix}/auth/login`, request.url));
  }

  //Redirect authenticated users from auth routes to their dashboards
  if (isAuthRoute) {
    return handleAuthRouteRedirection(userRole, request, langPrefix);
  }

  if (!isAllowedRoute) {

    const isAuthorized = validateRoleAccess(userRole, {
      isAdminRoute,
      isInstructorRoute,
      isStudentRoute,
    });

    if (!isAuthorized && !isAccessRoute) {
      console.log(`Unauthorized access to ${pathName}. Redirecting to /auth/access.`);
      return NextResponse.redirect(new URL(`/${langPrefix}/auth/access`, request.url));
    }

  }

  if (session?.error || (session && !isTokenValid(session.refreshToken as string))) {
    console.log(`Invalid refresh token detected. Redirecting to ${langPrefix}/auth/login.`);
    const response = NextResponse.redirect(new URL(`/${langPrefix}/auth/login?error=invalid-token`, request.url));

    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('__Secure-next-auth.session-token');
    response.cookies.delete('next-auth.csrf-token');
    response.cookies.delete('next-auth.callback-url');
    return response;
  }
  return intlResponse || NextResponse.next();
}


// helper functions 
//********************************************/

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

// Function to check role-based access
function validateRoleAccess(
  role: string | null,
  routes: { isAdminRoute: boolean; isInstructorRoute: boolean; isStudentRoute: boolean }
) {
  const roleAccessMap: { [key: string]: boolean } = {
    ROLE_ADMIN: routes.isAdminRoute,
    ROLE_INSTRUCTOR: routes.isInstructorRoute,
    ROLE_STUDENT: routes.isStudentRoute,
  };

  return role ? roleAccessMap[role] || false : false;
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
