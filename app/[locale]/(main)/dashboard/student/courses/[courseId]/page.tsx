import StudentCourseSections from '@/demo/components/(student)/(courseSections)/StudentCourseSections';
import CourseInfo from '@/demo/components/(student)/CourseInfo';
import InstructorInfo from '@/demo/components/InstructorInfo';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { Course } from '@/app/interfaces/interfaces';
import { authOptions } from '@/app/lib/nextAuth';
import { getServerSession } from 'next-auth';
import React from 'react';
import { CustomSession } from '@/app/interfaces/customSession';

interface PageProps {
    params: Promise<{ courseId: string }>;  // The params are now a Promise.
}

const StudentCourse = async ({ params }: PageProps) => {
    const session: CustomSession | null = await getServerSession(authOptions);
    const { courseId } = await params;
    let course: Course;
    const userId = session?.user?.id;
    if (!userId) {
        return;
    }
    const res = await fetch(API_ROUTES.COURSES.GET_ENROLLED_COURSE_FRO_STUDENT_BY_ID(userId, courseId), {
        headers: {
            Authorization: `Bearer ${session.accessToken}`
        },
        cache: 'no-store'
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
    }
    course = await res.json();

    return (
        <div className="grid">
            <InstructorInfo instructor={course.instructor} />
            <CourseInfo course={course} />
            <StudentCourseSections course={course} />
        </div>
    );
};

export default StudentCourse;
