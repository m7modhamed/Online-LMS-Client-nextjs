'use client';
import React, { useContext, useEffect, useState } from 'react';
import { PanelMenu } from 'primereact/panelmenu';
import { Box, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import styles from './style.module.css';
import { Course, Section } from '@/app/interfaces/interfaces';
import { useSession } from 'next-auth/react';
import { convertSecondsToHoursAndMinutes } from '@/app/lib/utilities';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { useTranslations } from 'use-intl';
import { Link } from '@/i18n/routing';

export default function LessonsSection({ course }: { course: Course | undefined }) {
    const [sections, setSections] = useState<Section[]>([]);
    const param = useParams();
    const { data, status } = useSession();
    const user = data?.user;
    const { layoutConfig } = useContext(LayoutContext);
    const t = useTranslations('studentCourseSections');

    useEffect(() => {
        const fetchCourseData = () => {
            setSections(course?.sections || []);
        };
        fetchCourseData();
    }, [param.courseId, user?.id, course]);

    if (status === 'loading') {
        return null;
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
                                <Link href={`/dashboard/student/courses/${course?.id}/lessons/${lesson.id}`}>
                                    <div className="flex justify-content-between px-2">
                                        <h6 className="m-2">{lesson?.title}</h6>
                                        <h6 className="m-2">{lesson.video ? convertSecondsToHoursAndMinutes(lesson?.video?.duration) : '00:00'}</h6>
                                    </div>
                                </Link>
                            </div>
                        ),
                        icon: 'pi pi-file'
                    }))
                : [])
        ]
    }));

    return (
        <div className="col-12">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                <div className="card min-h-screen">
                    <Box className={styles.sectionContainer}>
                        <Typography className={styles.sectionHeading} variant="h6" gutterBottom>
                            {t('sections')}
                        </Typography>
                        <PanelMenu model={panelMenuItems} style={{ width: '100%' }} />
                    </Box>
                </div>
            </div>
        </div>
    );
}
