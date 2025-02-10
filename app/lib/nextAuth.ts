import CredentialsProvider from 'next-auth/providers/credentials';
import { decodeToken } from './jwtDecode';
import { API_ROUTES } from '../api/apiRoutes';
import { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {

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

                if (res.ok && data.token) {
                    return {
                        id: '',
                        email: '',
                        token: data.token, // Include the token
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
                token.accessToken = user.token;
                token.sub = decodeToken(token.accessToken)?.exp;
                token.user = decodeToken(token.accessToken);
            }
            if (trigger === 'update') {               
                return {
                    ...token,
                    user: {
                        ...session.user,
                    }
                }
            }
            return token;
        },
        async session({ session, token }: any) {
            //const decodedToken = decodeToken(token.accessToken);
            session.accessToken = token.accessToken;
            session.user = token.user;
            return session;
        }
    },
    pages: {
        signIn: '/auth/login'
    },
};
