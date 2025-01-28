import AdminCourseSections from '@/app/(main)/(component)/(admin)/(courseSections)/AdminCourseSections';
import EditableCourseInfoForAdmin from '@/app/(main)/(component)/(admin)/EditableCourseInfoForAdmin';
import PublishSection from '@/app/(main)/(component)/(admin)/PublishSection';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { Course } from '@/app/interfaces/interfaces';
import { authOptions } from '@/app/lib/nextAuth';
import { getAdminCourse } from '@/demo/service/CourseServices';
import { getServerSession } from 'next-auth';
import React from 'react';

const AdminCourse = async ({ params }: { params: { courseId: string } }) => {
    //const course: Course = await getAdminCourse(params.courseId);
    const session = await getServerSession(authOptions);

    let course: Course | null = null;
    try {
        const res = await fetch(API_ROUTES.COURSES.GET_COURSE_FOR_REVIEW(params.courseId), {
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            },
            cache : 'no-store'
        });

        if (!res.ok) {
            throw new Error('Failed to fetch courses');
        }

        course = await res.json();
    } catch (err) {
        console.log('admin fetch error : ', err);
    }

    if (!course) {
        return (
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <p>there are no course to display</p>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Courses</h5>
                    <p>Use this page to create a new course by filling out the form below.</p>
                </div>
            </div>
            <EditableCourseInfoForAdmin course={course} />
            <AdminCourseSections course={course} />
            {course.status === 'IN_REVIEW' && <PublishSection course={course} />}
        </div>
    );
};

export default AdminCourse;
