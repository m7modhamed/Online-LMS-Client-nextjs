import { signOut } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { Menubar } from 'primereact/menubar';
import React from 'react';

const TopbarMenu = () => {
    const t = useTranslations('topbarMenu');
    const locale = useLocale();

    const items = [
        {
            label: t('setting'),
            icon: 'pi pi-user',
            items: [
                {
                    label: t('profile'),
                    icon: 'pi pi-user-edit',
                    url: '/user/update'
                },
                {
                    label: t('logout'),
                    icon: 'pi pi-user-minus',
                    command: () => {
                        signOut({ callbackUrl: `/${locale}/auth/login` });
                    }
                }
            ]
        }
    ];

    return <Menubar model={items} />;
};

export default TopbarMenu;
