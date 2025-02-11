'use client'
import { getRouteBasedRole } from '@/app/lib/utilities';
import { Link } from '@/i18n/routing';
import { getSession, signOut, useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react'

const AuthButtons = () => {

    const { data, status } = useSession();
    const t = useTranslations('MainNavbar');
    const locale = useLocale();
    const [image, setImage] = useState('');
    const handleLogout = () => {
        signOut({ callbackUrl: `/${locale}/auth/login` });
    };


    useEffect(() => {
        if (!data || !data.user?.image) {
            return;
        }
        const imageUrl = data.user?.image;
        const url = imageUrl.substring(imageUrl.lastIndexOf("public") + 6);
        setImage(url);

    }, [data])

    if (status === 'loading') {
        return;
    }

    return (
        <div>
            {/* Check if user data exists */}
            {data ? (
                <div style={{ alignItems: 'center', gap: '5px' }} className="flex items-center justify-between space-x-4">
                    {/* User Info Section */}
                    <Link href={`${getRouteBasedRole(data?.user?.role)}/update`}>
                       
                        <div style={{ alignItems: 'center' }} className="flex items-center p-3 rounded-lg  transition duration-800 cursor-pointer">

                            {/* User Avatar */}
                            <Avatar image={image
                                || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'} size="large" shape="circle" className="shadow-md" />

                            {/* User Name */}
                            <div className="mx-3 text-center">
                                <span className="text-lg font-semibold text-900">{data?.user?.firstName + ' ' + data?.user?.lastName || 'User'}</span>
                            </div>

                        </div>

                    </Link>
                    {/* Logout Button */}
                    <Button label={t('authButton.logout')} style={{ height: '30px' }} onClick={handleLogout} rounded className="bg-blue-500 text-white p-button-sm font-light" />

                </div>
            ) : (
                <div className="flex items-center space-x-4">
                    {/* Login & Register Buttons */}
                    <Link href={'/auth/login'}>
                        <Button label={t('authButton.login')} className="bg-blue-500 text-white p-button-sm font-light" />
                    </Link>
                    <Link href={'/auth/signup'}>
                        <Button label={t('authButton.signup')} text className="text-blue-500 p-button-sm font-light" />
                    </Link>
                    <Link href={'/auth/businessSignup'}>
                        <Button label={t('authButton.businessSignup')} text className="text-blue-500 p-button-sm font-light" />
                    </Link>
                </div>
            )}
        </div>
    )
}

export default AuthButtons