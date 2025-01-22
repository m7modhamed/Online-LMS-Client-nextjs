import { signOut } from 'next-auth/react';
import { Menubar } from 'primereact/menubar';
import React from 'react';

const TopbarMenu = () => {
    const items = [
        {
            label: 'Setting',
            icon: 'pi pi-user',
            items: [
                {
                    label: 'Update Profile',
                    icon: 'pi pi-user-edit',
                    url: '/user/update'
                },
                {
                    label: 'Logout',
                    icon: 'pi pi-user-minus',
                    command: () => {
                        signOut({ callbackUrl: '/auth/login' });
                    }
                }
            ]
        }
    ];

    return <Menubar model={items} />;
};

export default TopbarMenu;
