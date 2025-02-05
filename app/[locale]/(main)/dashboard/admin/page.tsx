/* eslint-disable @next/next/no-img-element */
import React, { Suspense } from 'react';
import StatisticsDashboard from '../../../../../demo/components/StatisticsDashboard';
import Loading from '@/app/loading';

const AdminDashboard = async () => {

    return (
        <div className="grid">
            <div className="m-auto col-12 xl:col-12">
                <Suspense fallback={<Loading />}>
                    <StatisticsDashboard />
                </Suspense>
            </div>

        </div>
    );
};

export default AdminDashboard;
