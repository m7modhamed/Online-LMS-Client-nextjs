import { API_ROUTES } from '@/app/api/apiRoutes';
import { Course } from '@/app/interfaces/interfaces';
import { authOptions } from '@/app/lib/nextAuth';
import { getServerSession } from 'next-auth';
import { CustomSession } from '@/app/interfaces/customSession';
import AdminCourseList from '@/demo/components/(admin)/AdminCourseList';

const AdminCoursesForReview = async () => {
    const session: CustomSession | null = await getServerSession(authOptions);
    let courses: Course[] = [];

    const res = await fetch(API_ROUTES.COURSES.GET_COURSES_FOR_REVIEW, {
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        },
        cache: 'no-store'
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch courses');
    }
    courses = await res.json();

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
