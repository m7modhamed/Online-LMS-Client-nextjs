import React from 'react';
import { getInstructorCourses } from '@/demo/service/CourseServices';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/nextAuth';
import dynamic from 'next/dynamic';
import InstructorCourseList from '../../../(component)/(instructor)/InstructorCourseList';

// Lazy load the CourseList component
const CourseList = dynamic(() => import('../../../(component)/(instructor)/InstructorCourseList'), {
    loading: () => <p>Loading courses...</p> // Optional fallback
});

export default async function MyCourses() {
    let session;
    try {
        session = await getServerSession(authOptions);
    } catch (err) {
        console.error('Error fetching session:', err);
    }

    const userId = session?.user?.id;
    const courses = await getInstructorCourses(userId);

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
