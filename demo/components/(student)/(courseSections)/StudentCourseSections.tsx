'use client';
import React, { useContext, useEffect, useState } from 'react';
import { PanelMenu } from 'primereact/panelmenu';
import { Box, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import styles from './style.module.css';
import { Course, Section } from '@/app/interfaces/interfaces';
import { useSession } from 'next-auth/react';
import EnrollCourse from '../enrollCourse';
import { Link } from '@/i18n/routing';
import { convertSecondsToHoursAndMinutes } from '@/app/lib/utilities';
import { LayoutContext } from '@/layout/context/layoutcontext';
import Loading from '@/app/loading';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { useTranslations } from 'use-intl';

export default function StudentCourseSections({ course }: { course: Course | undefined }) {
    const [sections, setSections] = useState<Section[]>([]);
    const { courseId }: { courseId: string } = useParams();
    const { data, status, update } = useSession();
    const user = data?.user;
    const [isEnrolled, setIsEnrolled] = useState(true);
    const router = useRouter();
    const { layoutConfig } = useContext(LayoutContext);
    const [loading, setLoading] = useState(true);
    const t = useTranslations('studentCourseSections');
    useEffect(() => {
        const checkEnrollment = async () => {
            if (course && user?.id && data) {
                try {
                    const res = await fetch(API_ROUTES.COURSES.CHECK_IS_ENROLL(user.id, course.id.toString()), {
                        headers: {
                            Authorization: `Bearer ${data?.accessToken}`
                        }
                    });
                    if (!res.ok) {
                        if (res.status === 401) {
                            console.log("Session expired, updating...");
                            await update();
                            return;
                        }
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
    }, [course, data, user?.id]);

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
                            {t('sections')}
                        </Typography>
                        <PanelMenu model={panelMenuItems} style={{ width: '100%' }} />
                    </Box>

                    <div id="enrollBtn">{!isEnrolled && <EnrollCourse courseId={courseId} />}</div>
                </div>
            </div>
        </div>
    );
}
