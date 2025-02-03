import { API_ROUTES } from '@/app/api/apiRoutes';
import { Course } from '@/app/interfaces/interfaces';
import { authOptions } from '@/app/lib/nextAuth';
import { getServerSession } from 'next-auth';
import React from 'react';
import StudentCourseList from '../../../../../../demo/components/(student)/StudentCourseList';
import { CustomSession } from '@/app/interfaces/customSession';

const learningCourses = async () => {
    const session: CustomSession | null = await getServerSession(authOptions);
    const user = session?.user;

    let courses: Course[] = [];
    let errorMessage: string | null = null;

    try {
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
    } catch (err: any) {
        errorMessage = err.message || 'An error occurred while fetching course data.';
    }

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
                <h4>learning Courses</h4>
            </div>
            <StudentCourseList courses={courses} />
        </div>
    );
};

export default learningCourses;
