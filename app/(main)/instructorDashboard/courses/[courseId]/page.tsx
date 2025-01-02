'use client';
import { CourseSections } from '@/app/(main)/(component)/courseSections/CourseSections';
import  EditableCourseInfo  from '@/app/(main)/(component)/EditableCourseInfo';
import { useAuth } from '@/app/Authentication/AuthContext';
import { Course } from '@/app/interfaces/interfaces';
import { getInstructorCourse } from '@/demo/service/CourseServices';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const InstructorCourse = () => {
    const param = useParams();
    console.log('param' , param)
    const { user } = useAuth();

    const [course, setCourse] = useState<Course>();

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                if (!user?.id || !param.courseId) return;

                const course = await getInstructorCourse(user.id, Number(param.courseId));
                console.log('course', course);

                // Ensure sections and lessons are properly initialized
                setCourse(course);
                // setSections(course.sections || []);
            } catch (error) {
                console.error('Failed to fetch course data:', error);
            }
        };

        fetchCourseData();
    }, [param.courseId, user?.id]);

    return (
        <div className="grid">
            {/* <Toast ref={toast} /> */}
            {/* <div className="col-12">
                <div className="card">
                    <h5>Course</h5>
                    <p>Use this page to show the course .</p>
                    <p>course with id : {param.courseId}</p>
                </div>
            </div> */}

            <EditableCourseInfo course={course}/>
            <CourseSections course={course}/>
        </div>
    );
};

export default InstructorCourse;
