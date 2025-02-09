import { CustomSession } from '@/app/interfaces/customSession';
import { getRouteBasedRole } from '@/app/lib/utilities';
import Loading from '@/app/loading';
import { signOut, useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { Menubar } from 'primereact/menubar';
import React from 'react';

const TopbarMenu = () => {
    const t = useTranslations('topbarMenu');
    const locale = useLocale();

    const { data, status } = useSession() as { data: CustomSession; status: string };

    if (status === 'loading') {
        return;
    }
    const items = [
        {
            label: t('setting'),
            icon: 'pi pi-user',
            items: [
                {
                    label: t('profile'),
                    icon: 'pi pi-user-edit',
                    url: `/${locale}/${getRouteBasedRole(data.user?.role)}/update`
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
