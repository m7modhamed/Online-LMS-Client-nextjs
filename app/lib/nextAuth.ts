import CredentialsProvider from 'next-auth/providers/credentials';
import { decodeToken } from './jwtDecode';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                // Call your Spring Boot API
                const res = await fetch('http://localhost:8080/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(credentials)
                });

                const data = await res.json();

                console.log('data', data);
                console.log('token', data.token);
                if (res.ok && data.token) {
                    return { token: data.token };
                } else {
                    throw new Error(data.message || 'Login failed');
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.accessToken = user.token;
            }
            return token;
        },
        async session({ session, token }: any) {
            const decodedToken = decodeToken(token.accessToken);
            session.accessToken = token.accessToken;
            session.user = decodedToken;
                        
            return session;
        }
    },
    pages : {
        signIn : '/auth/login'
    }
};
