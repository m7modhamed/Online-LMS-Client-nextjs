import React from 'react';
import { getTranslations } from 'next-intl/server';
import CourseList from '@/demo/components/CourseList';

export default async function MyCourses() {
    const t = await getTranslations('instructorCoursesPage'); // Get translations

    return (
        <div>
            <div className="col-12">
                <div className="card">
                    <h5>{t('title')}</h5>
                    <p>{t('description')}</p>
                </div>
            </div>

            <CourseList />
        </div>
    );
}
