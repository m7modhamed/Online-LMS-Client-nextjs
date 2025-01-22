import { InstructorCourseSections } from '@/app/(main)/(component)/(instructor)/courseSectionsForInstructor/InstructorCourseSections';
import EditableCourseInfo from '@/app/(main)/(component)/(instructor)/EditableCourseInfo';
import PublishCourse from '@/app/(main)/(component)/publishCourse';
import { authOptions } from '@/app/lib/nextAuth';
import { getInstructorCourse } from '@/demo/service/CourseServices';
import { getServerSession } from 'next-auth';
import React from 'react';

const InstructorCourse = async ({ params }: { params: { courseId: string } }) => {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user?.id || !params) {
        return;
    }

    let course;
    try {
        course = await getInstructorCourse(user?.id, Number(params.courseId));
    } catch (err: any) {
        return (
            <div className="card">
                <div>{err?.message}</div>
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
