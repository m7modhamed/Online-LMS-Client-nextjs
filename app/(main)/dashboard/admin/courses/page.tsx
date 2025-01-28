import AdminCourseList from '@/app/(main)/(component)/(admin)/AdminCourseList';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { Course } from '@/app/interfaces/interfaces';
import { authOptions } from '@/app/lib/nextAuth';
import { getServerSession } from 'next-auth';
import React, { Suspense } from 'react';

const CoursesPage = async () => {
    const session = await getServerSession(authOptions);
    let courses: Course[] = [];
    try {
        const res = await fetch(API_ROUTES.COURSES.GET_ALL_COURSES_FOR_ADMIN, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error('Failed to fetch courses');
        }

        courses = await res.json();
        console.log('courses from admins: ', courses);
    } catch (err) {
        console.log('admin fetch error : ', err);
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Courses</h5>
                    <p>Use this page to create a new course by filling out the form below.</p>
                </div>
                <AdminCourseList courses={courses} />
            </div>
        </div>
    );
};

export default CoursesPage;
