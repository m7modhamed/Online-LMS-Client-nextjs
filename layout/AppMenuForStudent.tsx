/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';
import { useTranslations } from 'use-intl';

const AppMenuForStudent = () => {
    const { layoutConfig, onMenuToggle } = useContext(LayoutContext);
    const t = useTranslations('sidebar');

    const model: AppMenuItem[] = [
        {
            label: t('home'),
            items: [{ label: t('dashboard'), icon: 'pi pi-fw pi-home', to: '/dashboard/student' }]
        },
        {
            label: t('courses'),
            items: [
                { label: t('courses'), icon: 'pi pi-fw pi-id-card', to: '/dashboard/student/courses' },
                { label: t('myCourses'), icon: 'pi pi-fw pi-check-square', to: '/dashboard/student/learningCourses' },
            ]
        },

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

export default AppMenuForStudent;
