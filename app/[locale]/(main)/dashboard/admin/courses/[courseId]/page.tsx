import AdminCourseSections from '@/demo/components/(admin)/(courseSections)/AdminCourseSections';
import PublishSection from '@/demo/components/(admin)/PublishSection';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { Course } from '@/app/interfaces/interfaces';
import { authOptions } from '@/app/lib/nextAuth';
import { getServerSession } from 'next-auth';
import React from 'react';
import { getTranslations } from 'next-intl/server';
import EditableCourseInfo from '@/demo/components/(instructor)/EditableCourseInfo';
import InstructorInfo from '@/demo/components/InstructorInfo';

interface PageProps {
    params: Promise<{ courseId: string }>;  // The params are now a Promise.
}

const AdminCourse = async ({ params }: PageProps) => {
    const { courseId } = await params;  // Await the Promise to get the courseId.
    const t = await getTranslations('adminCoursePage');

    const session = await getServerSession(authOptions);
    if (!session) {
        return;
    }
    let course: Course | null = null;

    const res = await fetch(API_ROUTES.COURSES.GET_COURSE_FOR_REVIEW(courseId), {
        headers: {
            Authorization: `Bearer ${session.accessToken}`
        },
        cache: 'no-store'
    });

    if (!res.ok) {
        
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch courses');
    }

    course = await res.json();

    if (!course) {
        return (
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <p>{t('noCoursesTitle')}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>{t('title')}</h5>
                    <p>{t('description')}</p>
                </div>
            </div>
            <InstructorInfo instructor={course.instructor}/>
            <EditableCourseInfo course={course} />
            <AdminCourseSections course={course} />
            {course.status === 'IN_REVIEW' && <PublishSection course={course} />}
        </div>
    );
};

export default AdminCourse;
