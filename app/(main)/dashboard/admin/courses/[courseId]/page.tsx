import { CourseSectionsForAdmin } from '@/app/(main)/(component)/(admin)/(courseSections)/AdminCourseSections';
import EditableCourseInfoForAdmin from '@/app/(main)/(component)/(admin)/EditableCourseInfoForAdmin';
import PublishSection from '@/app/(main)/(component)/(admin)/PublishSection';
import { Course } from '@/app/interfaces/interfaces';
import { getAdminCourse } from '@/demo/service/CourseServices';
import React from 'react';

const AdminCourse = async ({ params }: { params: { courseId: string } }) => {
    const course: Course = await getAdminCourse(params.courseId);

    console.log('admin course :', course);

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
            <CourseSectionsForAdmin course={course} />
            {course.status === 'IN_REVIEW' && <PublishSection course={course} />}
        </div>
    );
};

export default AdminCourse;
