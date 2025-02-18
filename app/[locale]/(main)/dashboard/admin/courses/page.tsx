import React from 'react';
import CourseList from '@/demo/components/CourseList';
import { getTranslations } from 'next-intl/server';

const CoursesPage = async () => {
    const t = await getTranslations('adminCourses');

    return (

        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>{t('title')}</h5>
                    <p>{t('description')}</p>
                </div>
                <CourseList />
            </div>
        </div>

    );
};

export default CoursesPage;
