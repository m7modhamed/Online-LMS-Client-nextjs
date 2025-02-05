import { useSession } from 'next-auth/react';
import AppMenuForAdmin from './AppMenuForAdmin';
import AppMenuForInstructor from './AppMenuForInstructor';
import AppMenuForStudent from './AppMenuForStudent';
import { CustomSession } from '@/app/interfaces/customSession';

const AppSidebar = () => {
    const { data, status } = useSession() as { data: CustomSession, status: string };

    return data?.user?.role === 'ROLE_ADMIN' ?
        <AppMenuForAdmin /> :
        data?.user?.role === 'ROLE_INSTRUCTOR' ?
            <AppMenuForInstructor /> :
            <AppMenuForStudent />;
};

export default AppSidebar;
