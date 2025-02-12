import React from 'react';
import { getTranslations } from 'next-intl/server';
import CourseList from '@/demo/components/CourseList';


const courses = async () => {
    const t = await getTranslations('coursesPage');

    return (
        <div className="">
            <div className="col-12">
                <div className="card">
                    <h5>{t('getStartedWithCourses')}</h5>
                    <p>{t('exploreCoursesToStartLearning')}</p>
                </div>
            </div>

            <CourseList />
        </div>
    );
};

export default courses;
