/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { CustomSession } from '@/app/interfaces/customSession';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/nextAuth';
import { getTranslations } from 'next-intl/server';


const StudentDashboard = async () => {


    const t = await getTranslations('statisticsDashboard')
    const session = await getServerSession(authOptions) as CustomSession;
    if (!session || !session?.user?.id) {
        return;
    }
    const res = await fetch(API_ROUTES.COURSES.GET_STUDENT_DASHBOARD_INFO(session.user.id), {
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
            {
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
