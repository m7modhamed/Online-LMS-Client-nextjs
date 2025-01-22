import AdminCourseList from '@/app/(main)/(component)/(admin)/AdminCourseList';
import { getAdminCoursesForReview } from '@/demo/service/CourseServices';
import React from 'react';

const AdminCoursesForReview = async () => {
    let courses;
    try {
        courses = await getAdminCoursesForReview();
    } catch (err) {
        console.log('admin fetch error : ', err);
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Courses</h5>
                    <p>Use this page to create a new course by filling out the form below.</p>
                </div>
                <AdminCourseList courses={courses} />
            </div>
        </div>
    );
};

export default AdminCoursesForReview;
