import LessonsSection from '@/app/(main)/(component)/(student)/(lessonsSections)/LessonsSection';
import StudentVideoSection from '@/app/(main)/(component)/(student)/StudentVideoSection';
import { Course } from '@/app/interfaces/interfaces';
import { authOptions } from '@/app/lib/nextAuth';
import { getEnrolledStudentCourse } from '@/demo/service/CourseServices';
import { getServerSession } from 'next-auth';
import React from 'react';

const studentLesson = async ({ params }: { params: { lessonId: Number; courseId: Number } }) => {
    const lessonId = params.lessonId;
    const courseId = params.courseId;
    const session = await getServerSession(authOptions);
    const user = session?.user;

    let course: Course;
    try {
        course = await getEnrolledStudentCourse(user?.id, courseId);
    } catch (err: any) {
        return (
            <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <h5 style={{ color: 'red' }}>{err?.message}</h5>
            </div>
        );
    }

    return (
        <div>
            <div className="card" style={{ marginBottom: '20px', textAlign: 'center' }}>
                <h5>Student Lesson</h5>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                {/* Column 1: Video Section */}
                <div style={{}}>
                    <StudentVideoSection studentId={user?.id} lessonId={lessonId} />
                </div>

                {/* Column 2: Lessons Section */}
                <div style={{ minHeight: '100vh' }}>
                    <LessonsSection course={course} />
                </div>
            </div>
        </div>
    );
};

export default studentLesson;
