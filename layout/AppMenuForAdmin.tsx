/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';
import { useTranslations } from 'use-intl';

const AppMenuForAdmin = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const t = useTranslations('sidebar');
    const model: AppMenuItem[] = [
        {
            label: t('home'),
            items: [{ label: t('dashboard'), icon: 'pi pi-fw pi-home', to: '/dashboard/admin' }]
        },
        {
            label: t('courses'),
            items: [
                { label: t('courses'), icon: 'pi pi-fw pi-id-card', to: '/dashboard/admin/courses' },
                { label: t('coursesForReview'), icon: 'pi pi-fw pi-check-square', to: '/dashboard/admin/reviewCourses' },
                { label: t('users'), icon: 'pi pi-users', to: '/dashboard/admin/users' },
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenuForAdmin;
