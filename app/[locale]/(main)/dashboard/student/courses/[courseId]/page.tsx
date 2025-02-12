import StudentCourseSections from '@/demo/components/(student)/(courseSections)/StudentCourseSections';
import CourseInfo from '@/demo/components/(student)/CourseInfo';
import InstructorInfo from '@/demo/components/InstructorInfo';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { Course } from '@/app/interfaces/interfaces';
import { authOptions } from '@/app/lib/nextAuth';
import { getServerSession } from 'next-auth';

interface PageProps {
    params: Promise<{ courseId: string }>;
}

const StudentCourse = async ({ params }: PageProps) => {
    const { courseId } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
        return;
        // throw new Error('Invalid user or course ID');
    }

    const userId = session.user.id;

    const res = await fetch(API_ROUTES.COURSES.GET_ENROLLED_COURSE_FRO_STUDENT_BY_ID(userId, courseId), {
        headers: {
            Authorization: `Bearer ${session.accessToken}`
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
    }

    const course: Course = await res.json();

    return (
        <div className="grid">
            <InstructorInfo instructor={course.instructor} />
            <CourseInfo course={course} />
            <StudentCourseSections course={course} />
        </div>
    );
};

export default StudentCourse;
