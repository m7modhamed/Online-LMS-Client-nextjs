/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState } from 'react';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/interfaces/customSession';
import { IDashboardInfo } from '@/app/interfaces/interfaces';
import { useTranslations } from 'use-intl';


const StudentDashboard = () => {
    const { data, status } = useSession() as { data: CustomSession; status: string };
    const [dashboardInfo, setDashboardInfo] = useState<IDashboardInfo>();
    const t = useTranslations('statisticsDashboard')

    useEffect(() => {
        const getDashboardInfo = async () => {
            try {
                let coursesInfo;
                if (status === 'authenticated' && data?.accessToken && data?.user?.id) {
                    const res = await fetch(API_ROUTES.COURSES.GET_STUDENT_DASHBOARD_INFO(data?.user?.id), {
                        headers: {
                            Authorization: `Bearer ${data.accessToken}`
                        },
                        cache: 'no-store'
                    });
                    coursesInfo = await res.json();
                }

                setDashboardInfo(coursesInfo);
            } catch (err) {
                console.log('err', err);
            }
        };
        getDashboardInfo();
    }, [data, status]);

    return (
        <div className="grid">
            {data &&
                <div className="col-12 lg:col-6 xl:col-12">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">{t('totalLearningCourses')}</span>
                                <div className="text-900 font-medium text-xl">
                                    {dashboardInfo?.coursesCount} <span className="text-500 text-sm">{t('coursesText')}</span>
                                </div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-book text-blue-500 text-xl" />
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">{dashboardInfo?.lastWeekCoursesCount} {t('newThisWeek')}</span>
                        <span className="text-500"> {t('addedThisWeek')}</span>
                    </div>
                </div>
            }

        </div>
    );
};

export default StudentDashboard;
