import React, { useEffect, useState } from 'react';
import { PanelMenu } from 'primereact/panelmenu';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../../Authentication/AuthContext';
import { useParams } from 'next/navigation';
import AddLessonDialog from '../AddLessonDialog';
import AddSectionDialog from '../AddSectionDialog/AddSectionDialog';
import { addNewLesson, addNewSection } from '@/demo/service/CourseServices';
import styles from './style.module.css';
import { Course, Lesson, Section } from '@/app/interfaces/interfaces';

export const CourseSections = ({ course }: { course: Course | undefined }) => {
    const [openSectionDialog, setOpenSectionDialog] = React.useState(false);
    const [openLessonDialog, setOpenLessonDialog] = React.useState(false);
    const [sectionId, setSectionId] = useState<Number>(0); // For associating lessons with a section
    const [sections, setSections] = useState<Section[]>([]);
    const param = useParams();
    const { user } = useAuth();

    useEffect(() => {
        const fetchCourseData = async () => {
            setSections(course?.sections || []); // Load sections when course is available
        };

        fetchCourseData();
    }, [param.courseId, user?.id, course]);

    const handleAddSection = () => setOpenSectionDialog(true);
    const handleAddLesson = (sectionId: Number) => {
        setSectionId(sectionId);
        setOpenLessonDialog(true);
    };

    const addSection = async (newSection: Section) => {
        try {
            newSection.position =
                sections.length > 0 ? Number(sections[sections.length - 1].position) + 1 : 1;

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
    
            newLesson.position =
                sectionLessons.length > 0
                    ? Number(sectionLessons[sectionLessons.length - 1].position) + 1
                    : 1;
    
            const response = await addNewLesson(sectionId, newLesson);
    
            setSections((prevSections) =>
                prevSections.map((section) =>
                    section.id === sectionId
                        ? { ...section, lessons: [...sectionLessons, response] }
                        : section
                )
            );
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
                        icon: 'pi pi-file',
                        command: () => {
                            // Navigate to the lesson
                            window.location.href = `/instructorDashboard/courses/${course?.id}/lessons/${lesson.id}`;
                        },
                    }))
                : []),
            {
                label: 'Add Lesson',
                icon: 'pi pi-plus',
                command: () => handleAddLesson(Number(section.id)),
            },
        ],
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
                                justifyContent: 'center',
                            }}
                        >
                            <Button
                                variant="contained"
                                color="info"
                                onClick={handleAddSection}
                                startIcon={<AddIcon />}
                            >
                                Add New Section
                            </Button>
                        </div>

                        {openSectionDialog && (
                            <AddSectionDialog
                                open={openSectionDialog}
                                handleClickOpen={() => setOpenSectionDialog(true)}
                                handleClose={() => setOpenSectionDialog(false)}
                                addSection={addSection}
                            />
                        )}
                        {openLessonDialog && (
                            <AddLessonDialog
                                open={openLessonDialog}
                                handleClickOpen={() => setOpenLessonDialog(true)}
                                handleClose={() => setOpenLessonDialog(false)}
                                addLesson={addLesson}
                                sectionId={sectionId}
                            />
                        )}
                    </Box>
                </div>
            </div>
        </div>
    );
};
