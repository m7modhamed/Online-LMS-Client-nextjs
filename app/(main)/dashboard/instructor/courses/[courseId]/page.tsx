'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { Course } from '@/app/interfaces/interfaces';
import EditableCourseInfo from '@/app/(main)/(component)/(instructor)/EditableCourseInfo';
import { InstructorCourseSections } from '@/app/(main)/(component)/(instructor)/courseSectionsForInstructor/InstructorCourseSections';
import PublishCourse from '@/app/(main)/(component)/publishCourse';
import { CustomSession } from '@/app/interfaces/customSession';
import { useParams } from 'next/navigation';

//{params} : {params : Promise<{courseId : string}>}
const InstructorCourse =  () => {
    const { data, status } = useSession() as { data: CustomSession, status: string };
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const { courseId }: { courseId: string } = useParams();
    //const courseId = (await params).courseId;


    useEffect(() => {
        if (status !== 'authenticated' || !data?.user?.id) return;

        const fetchCourse = async () => {
            try {
                const userId = data?.user?.id;
                if (!userId) {
                    return <div className='card'>userId not found</div>
                }
                const res = await fetch(API_ROUTES.COURSES.GET_INSTRUCTOR_COURSE(userId, courseId), {
                    headers: {
                        Authorization: `Bearer ${data.accessToken}`,
                    },
                });

                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.message);
                }

                const fetchedCourse = await res.json();
                setCourse(fetchedCourse);
            } catch (err) {
                console.error('Error fetching course:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [data, status, courseId]);

    if (loading) {
        return <div className="card"><h5>Loading...</h5></div>;
    }

    if (!course) {
        return <div className="card"><h5>No course found</h5></div>;
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
