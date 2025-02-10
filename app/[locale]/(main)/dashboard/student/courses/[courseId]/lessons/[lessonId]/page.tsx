import LessonsSection from '@/demo/components/(student)/(lessonsSections)/LessonsSection';
import StudentVideoSection from '@/demo/components/(student)/StudentVideoSection';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { Course } from '@/app/interfaces/interfaces';
import { authOptions } from '@/app/lib/nextAuth';
import { getServerSession } from 'next-auth';
import React from 'react';
import { getTranslations } from 'next-intl/server';

interface PageProps {
    params: Promise<{ courseId: string, lessonId: string }>;  // The params are now a Promise.
}

const studentLesson = async ({ params }: PageProps) => {
    const { courseId, lessonId } = await params;
    const session = await getServerSession(authOptions);
    const user = session?.user;
    const t = await getTranslations('studentLesson');
    let course: Course | null = null;
    let errorMessage: string | null = null;

    try {
        const userId = user?.id;
        if (!userId) {
            return;
        }
        const res = await fetch(API_ROUTES.COURSES.GET_ENROLLED_COURSE_FRO_STUDENT_BY_ID(userId, courseId), {
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message);
        }

        course = await res.json();
    } catch (err: any) {
        errorMessage = err.message || 'An error occurred while fetching course data.';
    }

    if (errorMessage) {
        return (
            <div
                className="card"
                style={{
                    padding: '20px',
                    maxWidth: '800px',
                    margin: '0 auto',
                    textAlign: 'center'
                }}
            >
                <h5 style={{ color: 'red' }}>{errorMessage}</h5>
            </div>
        );
    }

    return (
        <div>
            <div className="card" style={{ marginBottom: '20px' }}>
                <h5>{t('title')}</h5>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                <div>
                    <StudentVideoSection studentId={user?.id} lessonId={lessonId} />
                </div>

                <div style={{ minHeight: '100vh' }}>
                    <LessonsSection course={course!} />
                </div>
            </div>
        </div>

    );
};

export default studentLesson;
