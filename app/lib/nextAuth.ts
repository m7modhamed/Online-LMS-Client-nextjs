import CredentialsProvider from 'next-auth/providers/credentials';
import { decodeToken, isTokenValid } from './jwtDecode';
import { API_ROUTES } from '../api/apiRoutes';
import { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,

    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {

                const res = await fetch(API_ROUTES.USERS.LOGIN, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(credentials)
                });


                const data = await res.json();

                if (res.ok && data.accessToken && data.refreshToken) {
                    return {
                        id: '',
                        email: '',
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                    };
                } else {
                    throw new Error(data.message || 'Login failed');
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }: any) {

            if (user) {
                const decoded = decodeToken(user.accessToken);
                return {
                    ...token,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    user: decoded,
                    exp: decoded?.exp
                }
            }
            if (trigger === 'update') {
                if (!isTokenValid(token.accessToken)) {
                    return await refreshAccessToken(token);
                }
                return session ? {
                    ...token,
                    user: {
                        ...session?.user,
                    }
                } : token
            }

            if (!isTokenValid(token.accessToken)) {
                return await refreshAccessToken(token);
            }
            return token;
        },
        async session({ session, token }: any) {
            return {
                user: token.user,
                expires: token.exp,
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
                error: token?.error
            }
        }
    },
    pages: {
        signIn: '/auth/login'
    },
};


export async function refreshAccessToken(token: any) {
    try {
        const response = await fetch(API_ROUTES.USERS.REFRESH_TOKEN, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.refreshToken}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            console.log("Failed to refresh access token", error);
            return { ...token, error: "RefreshAccessTokenError" };
        }

        const refreshedTokens = await response.json();
        const decoded = decodeToken(refreshedTokens.accessToken);
        return {
            ...token,
            accessToken: refreshedTokens?.accessToken,
            user: decoded,
            refreshToken: refreshedTokens?.refreshToken ?? token.refreshToken,
            exp: decoded?.exp

        };
    } catch (error) {
        console.error("Error refreshing access token", error);
        return { ...token, error: "RefreshAccessTokenError" };
    }
}


