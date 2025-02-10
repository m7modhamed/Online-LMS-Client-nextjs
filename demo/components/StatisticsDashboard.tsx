import { API_ROUTES } from '@/app/api/apiRoutes';
import { authOptions } from '@/app/lib/nextAuth';
import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import React from 'react';

const StatisticsDashboard = async () => {
    const t = await getTranslations('statisticsDashboard')
    const session = await getServerSession(authOptions);
    if (!session || !session?.user?.id) {
        return;
    }
    const res = await fetch(session.user.role === 'ROLE_INSTRUCTOR'
        ? API_ROUTES.COURSES.GET_INSTRUCTOR_DASHBOARD_INFO(session?.user?.id)
        : API_ROUTES.COURSES.GET_ADMIN_DASHBOARD_INFO, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`
        },
        cache: 'no-store'
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
    }


    const coursesInfo = await res.json();

    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-6">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">{t('totalCourses')}</span>
                            <div className="text-900 font-medium text-xl">
                                {coursesInfo?.coursesCount} <span className="text-500 text-sm">{t('coursesText')}</span>
                            </div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-book text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{coursesInfo?.lastWeekCoursesCount} {t('newThisWeek')}</span>
                    <span className="text-500"> {t('addedThisWeek')}</span>
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">{t('draftCourses')}</span>
                            <div className="text-900 font-medium text-xl">
                                {coursesInfo?.draftCoursesCount} <span className="text-500 text-sm">{t('coursesText')}</span>
                            </div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-book text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{coursesInfo?.lastWeekCoursesCount} {t('newThisWeek')}</span>
                    <span className="text-500"> {t('addedThisWeek')}</span>
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">{t('coursesPendingReview')}</span>
                            <div className="text-900 font-medium text-xl">
                                {coursesInfo?.reviewCoursesCount} <span className="text-500 text-sm">{t('coursesText')}</span>
                            </div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-file-edit text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-purple-500 font-medium">{t('coursesAwaitingReview')}</span>
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-6">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">{t('publishedCourses')}</span>
                            <div className="text-900 font-medium text-xl">
                                {coursesInfo?.publishCoursesCount} <span className="text-500 text-sm">{t('coursesText')}</span>
                            </div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-green-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-verified text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{t('coursesPublished')}</span>
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">{t('archivedCourses')}</span>
                            <div className="text-900 font-medium text-xl">
                                {coursesInfo?.archivedCoursesCount} <span className="text-500 text-sm">{t('coursesText')}</span>
                            </div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-inbox text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-red-500 font-medium">{t('coursesNotPublished')}</span>
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">{t('deletedCourses')}</span>
                            <div className="text-900 font-medium text-xl">
                                {coursesInfo?.deletedCoursesCount} <span className="text-500 text-sm">{t('coursesText')}</span>
                            </div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-inbox text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-red-500 font-medium">{t('coursesMarkedAsDeleted')}</span>
                </div>
            </div>
        </div>

    );
};

export default StatisticsDashboard;
