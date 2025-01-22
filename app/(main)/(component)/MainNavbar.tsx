'use client';
import Loading from '@/app/loading';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { NodeRef } from '@/types';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { StyleClass } from 'primereact/styleclass';
import { classNames } from 'primereact/utils';
import React, { useContext, useRef, useState } from 'react';

const MainNavbar = () => {
    const [isHidden, setIsHidden] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const menuRef = useRef<HTMLElement | null>(null);
    const toggleMenuItemClick = () => {
        setIsHidden((prevState) => !prevState);
    };

    const { data, status } = useSession();

    if(status === 'loading'){
        return (
            <Loading/>
        )
    }
    const routeBasedRole = () => {
        const userRole = data?.user?.role;

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

    const handleLogout = () => {
        signOut({ callbackUrl: '/auth/login' });
    };

    return (
        <div className="py-4 px-4 mx-0 md:mx-6 lg:mx-8 lg:px-8 flex align-items-center justify-content-between relative lg:static">
            <Link href="/" className="flex align-items-center">
                <img src={`/layout/images/${layoutConfig.colorScheme === 'light' ? 'logo-dark' : 'logo-white'}.svg`} alt="Sakai Logo" height="50" className="mr-0 lg:mr-2" />
                <span className="text-900 font-medium text-2xl line-height-3 mr-8">SAKAI</span>
            </Link>
            <StyleClass nodeRef={menuRef as NodeRef} selector="@next" enterClassName="hidden" leaveToClassName="hidden" hideOnOutsideClick>
                <i ref={menuRef} className="pi pi-bars text-4xl cursor-pointer block lg:hidden text-700"></i>
            </StyleClass>
            <div className={classNames('align-items-center surface-0 flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2', { hidden: isHidden })} style={{ top: '100%' }}>
                <ul className="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer">
                    <li>
                        <a href="#home" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                            <span>Home</span>
                            <Ripple />
                        </a>
                    </li>
                    <li>
                        <a href="#features" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                            <span>Features</span>
                            <Ripple />
                        </a>
                    </li>
                    <li>
                        <a href="#highlights" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                            <span>Highlights</span>
                            <Ripple />
                        </a>
                    </li>
                    <li>
                        <a href="#pricing" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                            <span>Pricing</span>
                            <Ripple />
                        </a>
                    </li>
                </ul>
                <div className="flex items-center justify-center">
                    {/* Check if user data exists */}
                    {data ? (
                        <div style={{ alignItems: 'center', gap: '5px' }} className="flex items-center justify-between space-x-4">
                            {/* User Info Section */}
                            <Link href={routeBasedRole()}>
                                <div style={{ alignItems: 'center' }} className="flex items-center p-3 rounded-lg  transition duration-800 cursor-pointer">
                                    {/* User Avatar */}
                                    <Avatar image={data.user?.image || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'} size="large" shape="circle" className="shadow-md" />
                                    {/* User Name */}
                                    <div className="ml-2 text-center">
                                        <span className="text-lg font-semibold text-900">{data?.user?.firstName + ' ' + data?.user?.lastName || 'User'}</span>
                                    </div>
                                </div>
                            </Link>

                            {/* Logout Button */}
                            <Button label="Logout" style={{ height: '30px' }} onClick={handleLogout} rounded className="bg-blue-500 text-white p-button-sm font-light" />
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            {/* Login & Register Buttons */}
                            <Link href={'/auth/login'}>
                                <Button label="Login" rounded className="bg-blue-500 text-white p-button-sm font-light" />
                            </Link>
                            <Link href={'/auth/register'}>
                                <Button label="Register" text rounded className="text-blue-500 p-button-sm font-light" />
                            </Link>
                            <Link href={'/auth/businessRegister'}>
                                <Button label="Business Register" text rounded className="text-blue-500 p-button-sm font-light" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MainNavbar;
