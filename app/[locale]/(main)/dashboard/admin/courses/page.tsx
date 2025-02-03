import { API_ROUTES } from '@/app/api/apiRoutes';
import { Course } from '@/app/interfaces/interfaces';
import { authOptions } from '@/app/lib/nextAuth';
import { getServerSession } from 'next-auth';
import React from 'react';
import AdminCourseList from '../../../../../../demo/components/(admin)/AdminCourseList';
import { CustomSession } from '@/app/interfaces/customSession';

const CoursesPage = async () => {
    const session: CustomSession | null = await getServerSession(authOptions);
    let courses: Course[] = [];
    const res = await fetch(API_ROUTES.COURSES.GET_ALL_COURSES_FOR_ADMIN, {
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        },
        cache: 'no-store'
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch courses');
    }
    courses = await res.json();

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
