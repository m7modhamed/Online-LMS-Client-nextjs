/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';
import { useTranslations } from 'use-intl';

const AppMenuForInstructor = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const t = useTranslations('sidebar');

    const model: AppMenuItem[] = [
        {
            label: t('home'),
            items: [{ label: t('dashboard'), icon: 'pi pi-fw pi-home', to: '/dashboard/instructor' }]
        },
        {
            label: t('courses'),
            items: [
                { label: t('createCourse'), icon: 'pi pi-fw pi-id-card', to: '/dashboard/instructor/createCourse' },
                { label: t('myCourses'), icon: 'pi pi-fw pi-check-square', to: '/dashboard/instructor/courses' },
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

export default AppMenuForInstructor;
