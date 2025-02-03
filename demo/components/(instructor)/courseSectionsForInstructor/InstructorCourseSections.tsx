'use client';
import React, { useContext, useEffect, useState } from 'react';
import { PanelMenu } from 'primereact/panelmenu';
import { useParams } from 'next/navigation';
import styles from './style.module.css';
import { Course, Lesson, Section } from '@/app/interfaces/interfaces';
import { convertSecondsToHoursAndMinutes } from '@/app/utility/utilities';
import { useSession } from 'next-auth/react';
import AddSectionDialog from '../../AddSectionDialog/AddSectionDialog';
import AddLessonDialog from '../../AddLessonDialog';
import Link from 'next/link';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { CustomSession } from '@/app/interfaces/customSession';
import Loading from '@/app/loading';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { Button } from 'primereact/button';
import { useTranslations } from 'next-intl';

export function InstructorCourseSections({ course }: { course: Course | undefined }) {
    const [openSectionDialog, setOpenSectionDialog] = React.useState(false);
    const [openLessonDialog, setOpenLessonDialog] = React.useState(false);
    const [sectionId, setSectionId] = useState<Number>(0);
    const [sections, setSections] = useState<Section[]>([]);
    const { data, status } = useSession() as { data: CustomSession, status: string };
    const user = data?.user;
    const { layoutConfig } = useContext(LayoutContext);
    const [loading, setLoading] = useState(true);
    const { courseId }: { courseId: string } = useParams();
    const t = useTranslations('instructorCourseSections');
    useEffect(() => {
        const fetchCourseData = async () => {
            setSections(course?.sections || []);
            setLoading(false);
        };

        fetchCourseData();
    }, [courseId, user?.id, course]);

    if (loading || status === 'loading') {
        return <Loading />;
    }
    const handleAddSection = () => setOpenSectionDialog(true);

    const addSection = async (newSection: Section) => {
        try {
            newSection.position = sections.length > 0 ? Number(sections[sections.length - 1].position) + 1 : 1;

            const res = await fetch(API_ROUTES.SECTIONS.ADD_NEW_SECTION(courseId), {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${data.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSection)
            })
            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message);
            }
            const response = await res.json();
            setSections((prevSections) => [...prevSections, response]);
        } catch (error) {
            console.error('Error adding section:', error);
        }
    };

    const addLesson = async (newLesson: Lesson, sectionId: Number) => {
        try {
            console.log(newLesson)
            console.log(sectionId)
            const targetSection = sections.find((section) => section.id === sectionId);
            if (!targetSection) return;

            const sectionLessons = targetSection.lessons || [];

            newLesson.position = sectionLessons.length > 0 ? Number(sectionLessons[sectionLessons.length - 1].position) + 1 : 1;

            const res = await fetch(API_ROUTES.LESSONS.ADD_NEW_LESSON(sectionId.toString()), {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${data.accessToken}`,
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify(newLesson),
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message);
            }
            const response = await res.json();


            setSections((prevSections) => prevSections.map((section) => (section.id === sectionId ? { ...section, lessons: [...sectionLessons, response] } : section)));
        } catch (error) {
            console.error('Error adding lesson:', error);
        }
    };

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
                            <div className={styles.lessonInMenu}>
                                <Link href={`/dashboard/instructor/courses/${course?.id}/lessons/${lesson.id}`}>
                                    <div className="flex justify-content-between px-2">
                                        <h6 className="m-2">{lesson?.title}</h6>
                                        <h6 className="m-2">{lesson.video ? convertSecondsToHoursAndMinutes(lesson?.video?.duration) : '00:00'}</h6>
                                    </div>
                                </Link>

                            </div>
                        ),

                        icon: 'pi pi-file'
                    }))

                : []),
            {
                template: (
                    <div className="flex justify-content-center">
                        <button
                            className="p-button p-button-outlined"
                            onClick={() => {
                                setOpenLessonDialog(true);
                                setSectionId(Number(section.id));
                            }}
                        >
                            {t('addNewLesson')}
                        </button>
                    </div>
                )
            }



        ]
    }));

    return (
        <div className="col-12">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                <div className="card">
                    <div className={styles.sectionContainer}>
                        <h6 className={styles.sectionHeading}  >
                        {t('sections')}
                        </h6>
                        <PanelMenu model={panelMenuItems} style={{ width: '100%' }} />

                        <div
                            style={{
                                margin: '10px 0',
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                        >
                            <Button color="info" label={t('addNewSection')} onClick={handleAddSection} icon="pi pi-plus" />

                        </div>

                        {openSectionDialog && <AddSectionDialog open={openSectionDialog} handleClickOpen={() => setOpenSectionDialog(true)} handleClose={() => setOpenSectionDialog(false)} addSection={addSection} />}
                        {openLessonDialog && <AddLessonDialog open={openLessonDialog} handleClickOpen={() => setOpenLessonDialog(true)} handleClose={() => setOpenLessonDialog(false)} addLesson={addLesson} sectionId={sectionId} />}
                    </div>
                </div>
            </div>
        </div>
    );
}
