import { useSession } from "next-auth/react";
import { isTokenValid } from "./jwtDecode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

export function convertSecondsToHoursAndMinutes(seconds: number): string {
    const hours = Math.floor(seconds / 3600); // Get whole hours
    const minutes = Math.floor((seconds % 3600) / 60); // Get remaining minutes
    const remainingSeconds = Math.floor(seconds % 60); // Get remaining seconds (optional)

    return `${hours}h ${minutes}m ${remainingSeconds}s`;
}

export function convertHoursToSeconds(hours: number): number {
    return hours * 3600;
}
export const getRouteBasedRole = (userRole: string | undefined) => {

    switch (userRole) {
        case 'ROLE_ADMIN':
            return '/dashboard/admin';
        case 'ROLE_INSTRUCTOR':
            return '/dashboard/instructor';
        case 'ROLE_STUDENT':
            return '/dashboard/student';
        default:
            return '/';
    }
};

export const urlToFile = async (imageUrl: string, fileName: string): Promise<File> => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const fileType = blob.type || "image/jpeg"; // Default to JPEG if type is unknown
    return new File([blob], fileName, { type: fileType });
};


export const getImageUrl = (url: string) => {
    return url?.split('public')[1];

    // return url.substring(url.indexOf("public") + 6);
}

export const languages = [
    { label: 'English', value: 'english' },
    { label: 'Spanish', value: 'spanish' },
    { label: 'French', value: 'french' },
    { label: 'German', value: 'german' },
    { label: 'Italian', value: 'italian' },
    { label: 'Portuguese', value: 'portuguese' },
    { label: 'Russian', value: 'russian' },
    { label: 'Chinese', value: 'chinese' },
    { label: 'Japanese', value: 'japanese' },
    { label: 'Korean', value: 'korean' },
    { label: 'Arabic', value: 'arabic' },
    { label: 'Hindi', value: 'hindi' },
    { label: 'Bengali', value: 'bengali' },
    { label: 'Urdu', value: 'urdu' },
    { label: 'Turkish', value: 'turkish' },
    { label: 'Vietnamese', value: 'vietnamese' },
    { label: 'Polish', value: 'polish' },
    { label: 'Dutch', value: 'dutch' },
    { label: 'Swedish', value: 'swedish' },
    { label: 'Greek', value: 'greek' }
];
