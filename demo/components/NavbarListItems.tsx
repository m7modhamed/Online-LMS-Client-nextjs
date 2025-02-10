'use client'
import { getRouteBasedRole } from '@/app/lib/utilities'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing';
import { Ripple } from 'primereact/ripple'
import React, { Dispatch, SetStateAction } from 'react'

const NavbarListItems = ({ setIsHidden }: { setIsHidden: Dispatch<SetStateAction<boolean>> }) => {

    const { data, status } = useSession();
    const locale = useLocale();
    const t = useTranslations('MainNavbar');

    const toggleMenuItemClick = () => {
        setIsHidden((prevState) => !prevState);
    };

    if (status === 'loading') {
        return;
    }
    return (
        <div>
            <ul className="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer">
                <li>
                    <Link href="/#home" onClick={toggleMenuItemClick} className={`p-ripple flex m-0 mr-4 md:ml-5 px-0 py-3 font-medium line-height-3 ${locale === 'en' ? "text-900" : "text-2xl"}`}>
                        <span>{t('NavList.home')}</span>
                        <Ripple />
                    </Link>
                </li>
                {data && (
                    <li>
                        <Link href={getRouteBasedRole(data?.user?.role) + '/courses'} onClick={toggleMenuItemClick} className={`p-ripple flex m-0 mr-4 md:ml-5 px-0 py-3 font-medium line-height-3 ${locale === 'en' ? "text-900" : "text-2xl"}`}>
                            <span>{t('NavList.courses')}</span>
                            <Ripple />
                        </Link>
                    </li>
                )}
                {data && (
                    <li>
                        <Link href={getRouteBasedRole(data?.user?.role) + ''} onClick={toggleMenuItemClick} className={`p-ripple flex m-0 mr-4 md:ml-5 px-0 py-3 font-medium line-height-3 ${locale === 'en' ? "text-900" : "text-2xl"}`}>
                            <span>{t('NavList.dashboard')}</span>
                            <Ripple />
                        </Link>
                    </li>
                )}
            </ul>
        </div>
    )
}

export default NavbarListItems