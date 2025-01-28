import StudentCourseSections from '@/app/(main)/(component)/(student)/(courseSections)/StudentCourseSections';
import CourseInfo from '@/app/(main)/(component)/(student)/CourseInfo';
import InstructorInfo from '@/app/(main)/(component)/instructorInfo';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { Course } from '@/app/interfaces/interfaces';
import { authOptions } from '@/app/lib/nextAuth';
import { getEnrolledStudentCourse } from '@/demo/service/CourseServices';
import { getServerSession } from 'next-auth';
import React from 'react';

const StudentCourse = async ({ params }: { params: { courseId: string } }) => {
    const session = await getServerSession(authOptions);

    let course: Course;
    try {
        const userId = session?.user?.id;
        const res = await fetch(API_ROUTES.COURSES.GET_ENROLLED_COURSE_FRO_STUDENT_BY_ID(userId, params.courseId), {
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            },
            cache: 'no-store'
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message);
        }
        course = await res.json();
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
