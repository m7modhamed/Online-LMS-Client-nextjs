'use client';
import React, { useContext, useEffect, useState } from 'react';
import { PanelMenu } from 'primereact/panelmenu';
import { Box, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import styles from './style.module.css';
import { Course, Section } from '@/app/interfaces/interfaces';
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/interfaces/customSession';
import Link from 'next/link';
import { convertSecondsToHoursAndMinutes } from '@/app/utility/utilities';
import { LayoutContext } from '@/layout/context/layoutcontext';
import Loading from '@/app/loading';

export default function AdminCourseSections({ course }: { course: Course | undefined }) {
    const [sections, setSections] = useState<Section[]>([]);
    const param = useParams();
    const { layoutConfig } = useContext(LayoutContext);
    const { data, status } = useSession() as { data: CustomSession; status: string };
    const user = data?.user;
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchCourseData = async () => {
            setSections(course?.sections || []);
            setLoading(false);
        };

        fetchCourseData();
    }, [param.courseId, user?.id, course]);

    if (loading) {
        return <Loading />;
    }
    
    const panelMenuItems = sections.map((section) => ({
        label: section.title,
        icon: 'pi pi-folder',
        items: [
            // Sort the lessons by their position before mapping
            ...(section.lessons
                ? section.lessons
                      .sort((a, b) => Number(a.position) - Number(b.position)) // Explicit conversion to number
                      .map((lesson) => ({
                          label: lesson.title,
                          template: (
                              <div className={layoutConfig.colorScheme !== 'dark' ? styles.lessonInMenu : styles.lessonInMenuDark}>
                                  <Link href={`/dashboard/admin/courses/${course?.id}/lessons/${lesson.id}`}>
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
                <div className="card">
                    <Box className={styles.sectionContainer}>
                        <Typography className={styles.sectionHeading} variant="h6" gutterBottom>
                            Sections
                        </Typography>
                        <PanelMenu model={panelMenuItems} style={{ width: '100%' }} />
                    </Box>
                </div>
            </div>
        </div>
    );
}
