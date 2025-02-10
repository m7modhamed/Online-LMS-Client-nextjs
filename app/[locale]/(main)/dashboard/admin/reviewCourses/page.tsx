import { API_ROUTES } from '@/app/api/apiRoutes';
import { Course } from '@/app/interfaces/interfaces';
import { authOptions } from '@/app/lib/nextAuth';
import { getServerSession } from 'next-auth';
import CourseList from '@/demo/components/CourseList';
import { getTranslations } from 'next-intl/server';

const AdminCoursesForReview = async () => {
    const t = await getTranslations('coursesForReview');

    const session = await getServerSession(authOptions);
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
                    <h5>{t('title')}</h5>
                    <p>{t('description')}</p>
                </div>
                <CourseList courses={courses} />
            </div>
        </div>
    );
};

export default AdminCoursesForReview;
