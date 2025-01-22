import StudentCourseSections from '@/app/(main)/(component)/(student)/(courseSections)/StudentCourseSections';
import CourseInfo from '@/app/(main)/(component)/(student)/CourseInfo';
import InstructorInfo from '@/app/(main)/(component)/instructorInfo';
import { Course } from '@/app/interfaces/interfaces';
import { authOptions } from '@/app/lib/nextAuth';
import { getEnrolledStudentCourse, getStudentCourse } from '@/demo/service/CourseServices';
import { getServerSession } from 'next-auth';
import React from 'react';

const StudentCourse = async ({ params }: { params: { courseId: string } }) => {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    // if (!user?.id || !params) {
    //     return;
    // }
   

    let course: Course;
    try {
        course = await getEnrolledStudentCourse(user?.id, Number(params.courseId));
        console.log('course', course);
    } catch (err: any) {
        return (
            <div className="card">
                <div>{err?.message}</div>
            </div>
        );
    }
    return (
        <div className="grid">
            <InstructorInfo instructor={course.instructor} />
            <CourseInfo course={course} />
            <StudentCourseSections course={course} />
        </div>
    );
};

export default StudentCourse;
