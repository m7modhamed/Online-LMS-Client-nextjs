import { InstructorCourseSections } from '@/app/(main)/(component)/(instructor)/courseSectionsForInstructor/InstructorCourseSections';
import EditableCourseInfo from '@/app/(main)/(component)/(instructor)/EditableCourseInfo';
import PublishCourse from '@/app/(main)/(component)/publishCourse';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { Course } from '@/app/interfaces/interfaces';
import { authOptions } from '@/app/lib/nextAuth';
import { getServerSession } from 'next-auth';
import React from 'react';

const InstructorCourse = async ({ params }: { params: { courseId: string } }) => {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user?.id || !params) {
        return;
    }

    let course: Course | null = null;
    try {
        const userId = session?.user?.id;
        const res = await fetch(API_ROUTES.COURSES.GET_INSTRUCTOR_COURSE(userId, params.courseId), {
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            }
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message);
        }
        course = await res.json();
    } catch (err) {
        console.error('', err);
    }
    if (course == null) {
        return (
            <div className="card">
                <h5>No course found</h5>
            </div>
        );
    }
    return (
        <div className="grid">
            <EditableCourseInfo course={course} />
            <InstructorCourseSections course={course} />
            <PublishCourse course={course} />
        </div>
    );
};

export default InstructorCourse;
