import StudentCourseList from '@/app/(main)/(component)/(student)/StudentCourseList';
import { Course } from '@/app/interfaces/interfaces';
import { getCourses } from '@/demo/service/CourseServices';
import React from 'react';

const courses = async () => {
    const courses: Course[] = await getCourses();

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
