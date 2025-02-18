import { DefaultSession } from "next-auth";


declare module "next-auth" {
    interface Session {
        accessToken: string,
        refreshToken: string,
        user: {
            id: string;
            firstName: string;
            lastName: string;
            subject: string;
            role?: string; // Optional roles array
            isActive?: string; // Optional permissions array
            isBlocked?: string;
            image?: string
            error? :string

        } ;
    }
}