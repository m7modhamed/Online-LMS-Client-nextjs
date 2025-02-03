/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/interfaces/customSession';
import StatisticsDashboard from '../../../../../demo/components/StatisticsDashboard';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/nextAuth';

const instructorDashboard = async () => {
    // const { data, status } = useSession() as { data: CustomSession; status: string };
    // const [dashboardInfo, setDashboardInfo] = useState();

    // useEffect(() => {
    //     const getDashboardInfo = async () => {
    //         try {
    //             if (status === 'loading' || !data || !data?.user?.id) {
    //                 return;
    //             }
    //             let coursesInfo;
    //             const res = await fetch(API_ROUTES.COURSES.GET_INSTRUCTOR_DASHBOARD_INFO(data?.user?.id), {
    //                 headers: {
    //                     Authorization: `Bearer ${data.accessToken}`
    //                 },
    //                 cache: 'no-store'
    //             });

    //             if (!res.ok) {
    //                 const error = await res.json();
    //                 throw new Error(error.message);
    //             }
    //             coursesInfo = await res.json();


    //             setDashboardInfo(coursesInfo);
    //         } catch (err: any) {
    //             console.log('err', err.message);
    //         }
    //     };
    //     getDashboardInfo();
    // }, [data, status]);

    const session = await getServerSession(authOptions) as CustomSession;
    if (!session || !session?.user?.id) {
        return;
    }
    const res = await fetch(API_ROUTES.COURSES.GET_INSTRUCTOR_DASHBOARD_INFO(session?.user?.id), {
        headers: {
            Authorization: `Bearer ${session.accessToken}`
        },
        cache: 'no-store'
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
    }
    const dashboardInfo = await res.json();
    return (
        <div className="grid">
            <div className="col-12 xl:col-12">
                {<StatisticsDashboard coursesInfo={dashboardInfo} />}
            </div>
        </div>
    );
};

export default instructorDashboard;
