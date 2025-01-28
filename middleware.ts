import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { decodeToken, isTokenValid } from './app/lib/jwtDecode';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/dist/client/components/headers';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;


  const routes = {
    admin: ['/dashboard/admin'],
    instructor: ['/dashboard/instructor'],
    student: ['/dashboard/student'],
  };

  const protectedRoutes = [
    ...routes.admin,
    ...routes.instructor,
    ...routes.student,
  ];


  const isAuthRoute = pathname.startsWith('/auth') && !pathname.startsWith('/auth/access');
  const isAccessPage = pathname === '/auth/access';
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  const isAdminRoute = routes.admin.some((route) => pathname.startsWith(route));
  const isInstructorRoute = routes.instructor.some((route) => pathname.startsWith(route));
  const isStudentRoute = routes.student.some((route) => pathname.startsWith(route));


  const session = await getToken({ req: request });
  const token = session?.accessToken as string;
  const isValidToken = isTokenValid(token);
  console.log('session in middleware is :', session)

  if (!isValidToken && !isAuthRoute) {
    console.log('Invalid token detected. Redirecting to /auth/login.');

    const response = NextResponse.redirect(new URL('/auth/login', request.url));

    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('__Secure-next-auth.session-token');
    response.cookies.delete('next-auth.csrf-token');
    response.cookies.delete('next-auth.callback-url');
    return response;
  }



  if (!session && isProtectedRoute) {
    console.log('User not authenticated. Redirecting to /auth/login.');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const decodedToken = isValidToken ? decodeToken(token) : null;

  const userRole = decodedToken?.role || null;


  if (session && isAuthRoute) {
    return handleAuthRouteRedirection(userRole, request);
  }


  if (session) {
    const isAuthorized = validateRoleAccess(userRole, pathname, {
      isAdminRoute,
      isInstructorRoute,
      isStudentRoute,
    });

    if (!isAuthorized) {
      if (pathname !== '/auth/access') {
        console.log(`Unauthorized access. Redirecting to /auth/access.`);
        return NextResponse.redirect(new URL('/auth/access', request.url));
      }
    }
  }


  return NextResponse.next();
}


function handleAuthRouteRedirection(role: string | null, request: NextRequest) {
  const redirectionMap: { [key: string]: string } = {
    ROLE_ADMIN: '/dashboard/admin',
    ROLE_INSTRUCTOR: '/dashboard/instructor',
    ROLE_STUDENT: 'dashboard/student',
  };

  const redirectPath = redirectionMap[role];
  if (redirectPath) {
    console.log(`Authenticated user (${role}) redirected to ${redirectPath}`);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return NextResponse.next();
}


function validateRoleAccess(
  role: string | null,
  pathname: string,
  routes: { isAdminRoute: boolean; isInstructorRoute: boolean; isStudentRoute: boolean }
) {
  const roleAccessMap: { [key: string]: boolean } = {
    ROLE_ADMIN: routes.isAdminRoute,
    ROLE_INSTRUCTOR: routes.isInstructorRoute,
    ROLE_STUDENT: routes.isStudentRoute,
  };

  return role ? roleAccessMap[role] || false : false;
}

export const config = {
  matcher: [
    '/dashboard/admin/:path*',
    '/dashboard/instructor/:path*',
    '/dashboard/student/:path*',
    '/auth/:path*',
  ],
};
