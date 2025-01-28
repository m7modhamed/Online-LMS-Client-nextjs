import React from 'react';
import { getInstructorCourses } from '@/demo/service/CourseServices';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/nextAuth';
import InstructorCourseList from '../../../(component)/(instructor)/InstructorCourseList';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { Course } from '@/app/interfaces/interfaces';

export default async function MyCourses() {
    const session = await getServerSession(authOptions);
    let courses: Course[] = [];
    try {
        const userId = session?.user?.id;
        const res = await fetch(API_ROUTES.COURSES.GET_INSTRUCTOR_COURSES(userId), {
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            }
        });
        courses = await res.json();
    } catch (err) {
        console.error('', err);
    }

    if (!courses || courses.length === 0) {
        return (
            <div className="card">
                <h5>No courses found</h5>
                <p>It looks like you haven't created any courses yet.</p>
            </div>
        );
    }

    return (
        <div className="">
            <div className="col-12">
                <div className="card">
                    <h5>My Courses</h5>
                    <p>Use this page to start from scratch and place your custom content.</p>
                </div>
            </div>

            <InstructorCourseList courses={courses} />
        </div>
    );
}
