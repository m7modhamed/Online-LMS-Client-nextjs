export function convertSecondsToHoursAndMinutes(seconds: number): string {
    const hours = Math.floor(seconds / 3600); // Get whole hours
    const minutes = Math.floor((seconds % 3600) / 60); // Get remaining minutes
    const remainingSeconds = Math.floor(seconds % 60); // Get remaining seconds (optional)

    return `${hours}h ${minutes}m ${remainingSeconds}s`;
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