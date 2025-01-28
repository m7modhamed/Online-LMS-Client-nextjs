import { IDashboardInfo } from '@/app/interfaces/interfaces';
import Loading from '@/app/loading';
import React, { useEffect, useState } from 'react';

const StatisticsDashboard = ({ coursesInfo }: { coursesInfo: IDashboardInfo | undefined }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    if (loading) {
        return <Loading />;
    }
    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-6">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total Courses</span>
                            <div className="text-900 font-medium text-xl">
                                {coursesInfo?.coursesCount} <span className="text-500 text-sm">courses</span>
                            </div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-book text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{coursesInfo?.lastWeekCoursesCount} new </span>
                    <span className="text-500">added this week</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Draft Courses</span>
                            <div className="text-900 font-medium text-xl">
                                {coursesInfo?.draftCoursesCount} <span className="text-500 text-sm">courses</span>
                            </div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-book text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{coursesInfo?.lastWeekCoursesCount} new </span>
                    <span className="text-500">added this week</span>
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Courses Pending Review</span>
                            <div className="text-900 font-medium text-xl">
                                {coursesInfo?.reviewCoursesCount} <span className="text-500 text-sm">courses</span>
                            </div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-file-edit text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-purple-500 font-medium">Courses awaiting review</span>
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-6">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Published Courses</span>
                            <div className="text-900 font-medium text-xl">
                                {coursesInfo?.publishCoursesCount} <span className="text-500 text-sm">courses</span>
                            </div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-green-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-verified text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">Courses published</span>
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Archived Courses</span>
                            <div className="text-900 font-medium text-xl">
                                {coursesInfo?.archivedCoursesCount} <span className="text-500 text-sm">courses</span>
                            </div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-inbox text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-red-500 font-medium">Courses not published</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Deleted Courses</span>
                            <div className="text-900 font-medium text-xl">
                                {coursesInfo?.deletedCoursesCount} <span className="text-500 text-sm">courses</span>{' '}
                            </div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-inbox text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-red-500 font-medium">Courses marked as deleted</span>
                </div>
            </div>
        </div>
    );
};

export default StatisticsDashboard;
