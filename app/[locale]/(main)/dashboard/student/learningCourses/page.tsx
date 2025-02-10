import { API_ROUTES } from '@/app/api/apiRoutes';
import { Course } from '@/app/interfaces/interfaces';
import { authOptions } from '@/app/lib/nextAuth';
import { getServerSession } from 'next-auth';
import React from 'react';
import StudentCourseList from '../../../../../../demo/components/(student)/StudentCourseList';
import { getTranslations } from 'next-intl/server';

const learningCourses = async () => {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    const t = await getTranslations('studentCourses');

    let courses: Course[] = [];
    let errorMessage: string | null = null;

    const userId = user?.id;
    if (!userId) {
        return;
    }
    const res = await fetch(API_ROUTES.COURSES.GET_ENROLLED_COURSES_FRO_STUDENT(userId), {
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        },
        cache: 'no-store'
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
    }

    courses = await res.json();


    if (errorMessage) {
        return (
            <div
                className="card"
                style={{
                    padding: '20px',
                    maxWidth: '800px',
                    margin: '0 auto',
                    textAlign: 'center'
                }}
            >
                <h5 style={{ color: 'red' }}>{errorMessage}</h5>
            </div>
        );
    }

    return (
        <div>
            <div className="card">
                <h4>{t('title')}</h4>
                <h6>{t('description')}</h6>
            </div>
            <StudentCourseList courses={courses} />
        </div>
    );
};

export default learningCourses;
