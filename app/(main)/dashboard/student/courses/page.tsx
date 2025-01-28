import StudentCourseList from '@/app/(main)/(component)/(student)/StudentCourseList';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { Course } from '@/app/interfaces/interfaces';
import React from 'react';

const courses = async () => {
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

            <StudentCourseList courses={courses} />
        </div>
    );
};

export default courses;
