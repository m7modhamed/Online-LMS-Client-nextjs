'use client';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { NodeRef } from '@/types';
import { useTranslations } from 'next-intl';
import { StyleClass } from 'primereact/styleclass';
import { classNames } from 'primereact/utils';
import React, { useContext, useRef, useState } from 'react';
import NavbarListItems from './NavbarListItems';
import AuthButtons from './AuthButtons';
import LocaleSwitcher from './LocaleSwitcher';
import { Link } from '@/i18n/routing';

const MainNavbar = () => {
    const [isHidden, setIsHidden] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const menuRef = useRef<HTMLElement | null>(null);
    const t = useTranslations('MainNavbar');


    return (
        <div className="py-4 px-4 mx-0 md:mx-6 lg:mx-8 lg:px-8 flex align-items-center justify-content-between relative lg:static">

            <Link href="/">
                <div className="flex align-items-center w-96">
                    <img src={`/layout/images/${layoutConfig.colorScheme === 'light' ? 'logo-dark' : 'logo-white'}.svg`} alt="Sakai Logo" height="50" className="mr-0 lg:mr-2" />
                    <span className="text-900 font-medium text-2xl line-height-3 mr-4 " style={{ width: '210px' }}>{t('websiteName')}</span>
                </div>
            </Link>
            <StyleClass nodeRef={menuRef as NodeRef} selector="@next" enterClassName="hidden" leaveToClassName="hidden" hideOnOutsideClick>
                <i ref={menuRef} className="pi pi-bars text-4xl cursor-pointer block lg:hidden text-700"></i>
            </StyleClass>
            <div className={classNames('align-items-center surface-0 flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2', { hidden: isHidden })} style={{ top: '100%' }}>
                <NavbarListItems setIsHidden={setIsHidden} />
                <div className="flex items-center justify-center">
                    <AuthButtons />
                </div>
            </div>

            <div className='flex align-items-center justify-content-center mx-6'>
                <LocaleSwitcher />
            </div>

        </div>
    );
};

export default MainNavbar;
