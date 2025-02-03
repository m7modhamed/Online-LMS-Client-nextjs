import { API_ROUTES } from '@/app/api/apiRoutes';
import { Course } from '@/app/interfaces/interfaces';
import React from 'react';
import StudentCourseList from '../../../../../../demo/components/(student)/StudentCourseList';
import { getTranslations } from 'next-intl/server';

const courses = async () => {
    const t = await getTranslations('coursesPage');
    let courses: Course[] = [];
    try {
        const res = await fetch(API_ROUTES.COURSES.GET_ALL_COURSES, {
            cache: 'no-store'
        });

        courses = await res.json();
    } catch (err) {
        console.error('fetch courses error : ', err);
    }

    if (!courses || courses.length === 0) {
        return (
            <div className="card">
            <h5>{t('noContentFound')}</h5>
            <p>{t('noContentMessage')}</p>
        </div>
        
        );
    }

    return (
        <div className="">
            <div className="col-12">
                <div className="card">
                    <h5>{t('getStartedWithCourses')}</h5>
                    <p>{t('exploreCoursesToStartLearning')}</p>
                </div>
            </div>

            <StudentCourseList courses={courses} />
        </div>
    );
};

export default courses;
