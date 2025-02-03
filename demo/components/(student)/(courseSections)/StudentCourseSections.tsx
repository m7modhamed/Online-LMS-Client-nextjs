'use client';
import React, { useContext, useEffect, useState } from 'react';
import { PanelMenu } from 'primereact/panelmenu';
import { Box, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import styles from './style.module.css';
import { Course, Section } from '@/app/interfaces/interfaces';
import { useSession } from 'next-auth/react';
import EnrollCourse from '../enrollCourse';
import Link from 'next/link';
import { convertSecondsToHoursAndMinutes } from '@/app/utility/utilities';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { CustomSession } from '@/app/interfaces/customSession';
import Loading from '@/app/loading';
import { API_ROUTES } from '@/app/api/apiRoutes';

export default function StudentCourseSections({ course }: { course: Course | undefined }) {
    const [sections, setSections] = useState<Section[]>([]);
    const {courseId} : {courseId : string} = useParams();
    const { data, status } = useSession() as { data: CustomSession; status: string };
    const user = data?.user;
    const [isEnrolled, setIsEnrolled] = useState(true);
    const router = useRouter();
    const { layoutConfig } = useContext(LayoutContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkEnrollment = async () => {
            if (course && user?.id) {
                try {
                    const res = await fetch(API_ROUTES.COURSES.CHECK_IS_ENROLL(user.id, course.id.toString()), {
                        headers: {
                            Authorization: `Bearer ${data?.accessToken}`
                        }
                    });
                    if (!res.ok) {
                        const error = await res.json();
                        throw new Error(error.message);
                    }
                    const isEnroll = await res.json();
                    setIsEnrolled(isEnroll);
                } catch (err: any) {
                    console.error('Error checking enrollment:', err?.message);
                }
            }
            setLoading(false);
        };

        checkEnrollment();
    }, [course, user?.id , data.accessToken]);

    useEffect(() => {
        if (course) {
            setSections(course.sections || []);
        }
        setLoading(false);
    }, [course]);

    if (loading || status === 'loading') {
        return <Loading />;
    }
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

                    <div id="enrollBtn">{!isEnrolled && <EnrollCourse courseId={courseId} />}</div>
                </div>
            </div>
        </div>
    );
}
