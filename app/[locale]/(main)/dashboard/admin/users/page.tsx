import UserTableList from '@/demo/components/UserTableList';
import { useTranslations } from 'next-intl';
import React from 'react';

const Users = () => {
    const t = useTranslations("userTable");

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>{t('usersTitle')}</h5>
                    <p>{t('usersDescription')}</p>
                </div>
            </div>
            <UserTableList />
        </div>
    );
};

export default Users;
