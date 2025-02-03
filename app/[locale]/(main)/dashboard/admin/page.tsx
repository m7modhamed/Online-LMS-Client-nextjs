/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState } from 'react';
import StatisticsDashboard from '../../../../../demo/components/StatisticsDashboard';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/interfaces/customSession';
import { useTranslations } from 'next-intl';



const AdminDashboard = () => {
    const { data, status } = useSession() as { data: CustomSession; status: string };
    const [dashboardInfo, setDashboardInfo] = useState();
    const t = useTranslations();

    useEffect(() => {
        const fetchData = () => {
            if (status === 'loading' && !data?.accessToken) {
                return;
            }
            fetch(API_ROUTES.COURSES.GET_ADMIN_DASHBOARD_INFO, {
                headers: {
                    Authorization: `Bearer ${data.accessToken}`
                }
            })
                .then((res) => res.json())
                .then((json) => {
                    setDashboardInfo(json);
                })
                .catch((err) => {
                    console.log('Error fetching dashboard info:', err);
                });

        }
        fetchData();
    }, [status, data]);

    return (
        <div className="grid">
            <div className="m-auto col-12 xl:col-12">
                <StatisticsDashboard coursesInfo={dashboardInfo} />
            </div>

        </div>
    );
};

export default AdminDashboard;
