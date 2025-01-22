import { useSession } from 'next-auth/react';
import AppMenuForAdmin from './AppMenuForAdmin';
import AppMenuForInstructor from './AppMenuForInstructor';
import AppMenuForStudent from './AppMenuForStudent';
import { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppSidebar = () => {
    const { data, status } = useSession();
    
    return data?.user?.role === 'ROLE_ADMIN' ? <AppMenuForAdmin /> : data?.user?.role === 'ROLE_INSTRUCTOR' ? <AppMenuForInstructor/> : <AppMenuForStudent/>;
};

export default AppSidebar;
