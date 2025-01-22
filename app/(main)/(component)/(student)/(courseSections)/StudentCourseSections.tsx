'use client';
import React, { useContext, useEffect, useState } from 'react';
import { PanelMenu } from 'primereact/panelmenu';
import { Box, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import styles from './style.module.css';
import { Course, Section } from '@/app/interfaces/interfaces';
import { useSession } from 'next-auth/react';
import EnrollCourse from '../enrollCourse';
import { isStudentEnrolled } from '@/demo/service/CourseServices';
import Link from 'next/link';
import { convertSecondsToHoursAndMinutes } from '@/app/utility/utilities';
import { LayoutContext } from '@/layout/context/layoutcontext';

export default function StudentCourseSections({ course }: { course: Course | undefined }) {
    const [sections, setSections] = useState<Section[]>([]);
    const param = useParams();
    const { data, status } = useSession();
    const user = data?.user;
    const [isEnrolled, setIsEnrolled] = useState(true);
    const router = useRouter();
    const { layoutConfig } = useContext(LayoutContext);

    useEffect(() => {
        const checkEnrollment = async () => {
            if (course && user?.id) {
                try {
                    const isEnroll = await isStudentEnrolled(course.id, user.id);
                    setIsEnrolled(isEnroll);
                } catch (err: any) {
                    console.error('Error checking enrollment:', err?.message);
                }
            }
        };
    
        checkEnrollment();
    }, [course, user?.id]); // Only runs when `course` or `user.id` changes
    
    useEffect(() => {
        if (course) {
            setSections(course.sections || []); // Set sections if `course` data is available
        }
    }, [course]); // Only runs when `course` changes
    

    const panelMenuItems = sections.map((section) => ({
        label: section.title,
        icon: 'pi pi-folder',
        items: [
            ...(section.lessons
                ? section.lessons
                      .sort((a, b) => Number(a.position) - Number(b.position))
                      .map((lesson) => ({
                          label: lesson.title,
                          template: (
                              <div className={layoutConfig.colorScheme !== 'dark' ? styles.lessonInMenu : styles.lessonInMenuDark}>
                                  <Link href={isEnrolled ? `/dashboard/student/courses/${course?.id}/lessons/${lesson.id}` : '#enrollBtn'}>
                                      <div className="flex justify-content-between px-2">
                                          <h6 className="m-2">{lesson?.title}</h6>
                                          <h6 className="m-2">{lesson.video ? convertSecondsToHoursAndMinutes(lesson?.video?.duration) : '00:00'}</h6>
                                      </div>
                                  </Link>
                              </div>
                          ),
                          icon: 'pi pi-file',
                          command: () => {
                              if (isEnrolled) {
                                  router.push(`/dashboard/student/courses/${course?.id}/lessons/${lesson.id}`);
                              }
                          }
                      }))
                : [])
        ]
    }));

    return (
        <div className="col-12">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                <div className="card">
                    <Box className={styles.sectionContainer}>
                        <Typography className={styles.sectionHeading} variant="h6" gutterBottom>
                            Sections
                        </Typography>
                        <PanelMenu model={panelMenuItems} style={{ width: '100%' }} />
                    </Box>

                    <div id="enrollBtn">{!isEnrolled && <EnrollCourse courseId={Number(param.courseId)} />}</div>
                </div>
            </div>
        </div>
    );
}
