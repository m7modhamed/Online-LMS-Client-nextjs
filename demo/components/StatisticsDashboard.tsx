import { IDashboardInfo } from '@/app/interfaces/interfaces';
import Loading from '@/app/loading';
import { getTranslations } from 'next-intl/server';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'use-intl';

const StatisticsDashboard = async ({ coursesInfo }: { coursesInfo: IDashboardInfo | undefined }) => {
    // const [loading, setLoading] = useState(true);
    const t = await getTranslations('statisticsDashboard')

    // useEffect(() => {
    //     setLoading(false);
    // }, []);

    // if (loading) {
    //     return <Loading />;
    // }
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
