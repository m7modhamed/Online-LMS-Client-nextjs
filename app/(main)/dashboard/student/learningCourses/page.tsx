import StudentCourseList from '@/app/(main)/(component)/(student)/StudentCourseList';
import { Course } from '@/app/interfaces/interfaces';
import { authOptions } from '@/app/lib/nextAuth';
import { getEnrolledStudentCourses } from '@/demo/service/CourseServices';
import { getServerSession } from 'next-auth';
import React from 'react';

const learningCourses = async () => {
    const session = await getServerSession(authOptions);

    const courses : Course[] =await getEnrolledStudentCourses(session?.user?.id);

    return (
        <div className="card">
            <h4>learning Courses</h4>
            <StudentCourseList courses={courses} />
        </div>
    );
};

export default learningCourses;
