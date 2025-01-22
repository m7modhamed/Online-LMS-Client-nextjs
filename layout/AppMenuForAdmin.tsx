/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';

const AppMenuForAdmin = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard/admin' }]
        },
        {
            label: 'Courses',
            items: [
                { label: 'Courses', icon: 'pi pi-fw pi-id-card', to: '/dashboard/admin/courses' },
                { label: 'Courses for Review', icon: 'pi pi-fw pi-check-square', to: '/dashboard/admin/reviewCourses' },
                { label: 'Students', icon: 'pi pi-users', to: '/dashboard/admin/students' },
                { label: 'Instructors', icon: 'pi pi-users', to: '/dashboard/admin/Instructors' }
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}

                {/* <Link href="https://blocks.primereact.org" target="_blank" style={{ cursor: 'pointer' }}>
                    <img alt="Prime Blocks" className="w-full mt-3" src={`/layout/images/banner-primeblocks${layoutConfig.colorScheme === 'light' ? '' : '-dark'}.png`} />
                </Link> */}
            </ul>
        </MenuProvider>
    );
};

export default AppMenuForAdmin;
