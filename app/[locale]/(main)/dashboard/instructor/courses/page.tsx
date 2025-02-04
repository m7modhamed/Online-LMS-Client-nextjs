import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/nextAuth';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { Course } from '@/app/interfaces/interfaces';
import { CustomSession } from '@/app/interfaces/customSession';
import { getTranslations } from 'next-intl/server';
import CourseList from '@/demo/components/CourseList';

export default async function MyCourses() {
    const t = await getTranslations('instructorCoursesPage'); // Get translations
    const session: CustomSession | null = await getServerSession(authOptions);
    let courses: Course[] = [];

    try {
        const userId = session?.user?.id;
        if (!userId) {
            return;
        }
        const res = await fetch(API_ROUTES.COURSES.GET_INSTRUCTOR_COURSES(userId), {
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message);
        }
        courses = await res.json();
    } catch (err: any) {
        console.error('', err.message);
    }

    if (!courses || courses.length === 0) {
        return (
            <div className="card">
                <h5>{t('noCoursesTitle')}</h5>
                <p>{t('noCoursesMessage')}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="col-12">
                <div className="card">
                    <h5>{t('title')}</h5>
                    <p>{t('description')}</p>
                </div>
            </div>

            <CourseList courses={courses} />
        </div>
    );
}
