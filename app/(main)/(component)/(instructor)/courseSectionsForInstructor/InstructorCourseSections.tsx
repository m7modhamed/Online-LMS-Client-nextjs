'use client';
import React, { useContext, useEffect, useState } from 'react';
import { PanelMenu } from 'primereact/panelmenu';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useParams } from 'next/navigation';
import { addNewLesson, addNewSection } from '@/demo/service/CourseServices';
import styles from './style.module.css';
import { Course, Lesson, Section } from '@/app/interfaces/interfaces';
import { convertSecondsToHoursAndMinutes } from '@/app/utility/utilities';
import { useSession } from 'next-auth/react';
import AddSectionDialog from '../../AddSectionDialog/AddSectionDialog';
import AddLessonDialog from '../../AddLessonDialog';
import Link from 'next/link';
import { LayoutContext } from '@/layout/context/layoutcontext';

export function InstructorCourseSections({ course }: { course: Course | undefined }) {
    const [openSectionDialog, setOpenSectionDialog] = React.useState(false);
    const [openLessonDialog, setOpenLessonDialog] = React.useState(false);
    const [sectionId, setSectionId] = useState<Number>(0); // For associating lessons with a section
    const [sections, setSections] = useState<Section[]>([]);
    const param = useParams();
    const { data, status } = useSession();
    const user = data?.user;
    const { layoutConfig } = useContext(LayoutContext);

    useEffect(() => {
        const fetchCourseData = async () => {
            setSections(course?.sections || []); // Load sections when course is available
        };

        fetchCourseData();
    }, [param.courseId, user?.id, course]);

    const handleAddSection = () => setOpenSectionDialog(true);
 

    const addSection = async (newSection: Section) => {
        try {
            newSection.position = sections.length > 0 ? Number(sections[sections.length - 1].position) + 1 : 1;

            const response = await addNewSection(Number(param.courseId), newSection);
            setSections((prevSections) => [...prevSections, response]);
        } catch (error) {
            console.error('Error adding section:', error);
        }
    };

    const addLesson = async (newLesson: Lesson, sectionId: Number) => {
        try {
            const targetSection = sections.find((section) => section.id === sectionId);
            if (!targetSection) return;

            const sectionLessons = targetSection.lessons || []; // Default to an empty array if lessons are undefined

            newLesson.position = sectionLessons.length > 0 ? Number(sectionLessons[sectionLessons.length - 1].position) + 1 : 1;

            const response = await addNewLesson(sectionId, newLesson);

            setSections((prevSections) => prevSections.map((section) => (section.id === sectionId ? { ...section, lessons: [...sectionLessons, response] } : section)));
        } catch (error) {
            console.error('Error adding lesson:', error);
        }
    };

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
                                  <Link href={`/dashboard/instructor/courses/${course?.id}/lessons/${lesson.id}`}>
                                      <div className="flex justify-content-between px-2">
                                          <h6 className="m-2">
                                              {lesson?.title}
                                          </h6>
                                          <h6 className="m-2" >
                                              {lesson.video ? convertSecondsToHoursAndMinutes(lesson?.video?.duration) : '00:00'}
                                          </h6>
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

                        <div
                            style={{
                                margin: '10px 0',
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                        >
                            <Button variant="contained" color="info" onClick={handleAddSection} startIcon={<AddIcon />}>
                                Add New Section
                            </Button>
                        </div>

                        {openSectionDialog && <AddSectionDialog open={openSectionDialog} handleClickOpen={() => setOpenSectionDialog(true)} handleClose={() => setOpenSectionDialog(false)} addSection={addSection} />}
                        {openLessonDialog && <AddLessonDialog open={openLessonDialog} handleClickOpen={() => setOpenLessonDialog(true)} handleClose={() => setOpenLessonDialog(false)} addLesson={addLesson} sectionId={sectionId} />}
                    </Box>
                </div>
            </div>
        </div>
    );
}
