import { Box, Button, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styles from './style.module.css';
import { Course, Lesson, Section } from '../../../interfaces/interfaces';
import Collapsible from 'react-collapsible';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../../Authentication/AuthContext';
import { addNewLesson, addNewSection } from '@/demo/service/CourseServices';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AddLessonDialog from '../AddLessonDialog';
import AddSectionDialog from '../AddSectionDialog/AddSectionDialog';

export const CourseSections = ({ course }: { course: Course | undefined }) => {
    const [openSectionDialog, setOpenSectionDialog] = React.useState(false);
    const [openLessonDialog, setOpenLessonDialog] = React.useState(false);

    //section id state for enter/insert lesson in related section
    const [sectionId, setSectionId] = useState<Number>(0);

    const handleClickOpenSectionDialog = () => {
        setOpenSectionDialog(true);
    };

    const handleCloseSectionDialog = () => {
        setOpenSectionDialog(false);
    };

    const handleAddSection = () => {
        setOpenSectionDialog(true);
    };

    const handleClickOpenLessonDialog = () => {
        setOpenLessonDialog(true);
    };

    const handleCloseLessonDialog = () => {
        setOpenLessonDialog(false);
    };

    const handleAddLesson = (sectionId: Number) => {
        setSectionId(sectionId);
        console.log(sectionId);
        setOpenLessonDialog(true);
    };

    const addSection = async (newSection: Section) => {
        try {
            if (sections.length > 0) {
                newSection.position = Number(sections[sections.length - 1].position) + 1;
            } else {
                // Set the position to 1 if this is the first section
                newSection.position = 1;
            }

            const response = await addNewSection(Number(param.courseId), newSection);
            console.log('Section added successfully:', response);

            setSections((prevSections) => [...prevSections, response]);
        } catch (error) {
            console.error('Error adding section:', error);
        }
    };

    const param = useParams();
    const { user } = useAuth();

    const [sections, setSections] = useState<Section[]>([]);

    useEffect(() => {
        const fetchCourseData = async () => {
            // Ensure sections and lessons are properly initialized
            setSections(course?.sections || []); // Default to empty array if undefined
        };

        fetchCourseData();
    }, [param.courseId, user?.id, course]);

    const addLesson = async (newLesson: Lesson, sectionId: Number) => {
        try {
            // Find the section in which the lesson is being added
            const targetSection = sections.find((section) => section.id === sectionId);

            if (!targetSection) {
                console.error(`Section with ID ${sectionId} not found`);
                return;
            }

            // Get lessons of the specific section
            const sectionLessons = targetSection.lessons || [];

            // Calculate the new position
            newLesson.position = sectionLessons.length > 0 ? Number(sectionLessons[sectionLessons.length - 1].position) + 1 : 1;

            // Add the new lesson via API
            const response = await addNewLesson(sectionId, newLesson);
            console.log('Lesson added successfully:', response);

            // Update the sections state to add the new lesson to the specific section
            setSections((prevSections) =>
                prevSections.map((section) =>
                    section.id === sectionId
                        ? {
                              ...section,
                              lessons: [...(section.lessons || []), response] // Add the new lesson
                          }
                        : section
                )
            );
        } catch (error) {
            console.error('Error adding lesson:', error);
        }
    };

    return (
        <div className="col-12">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                <div className="card">
                    <Box className={styles.sectionContainer}>
                        <Box>
                            <Typography className={styles.sectionHeading} variant="h6" gutterBottom>
                                Sections
                            </Typography>

                            {sections.map((section, index) => (
                                <Collapsible
                                    key={index}
                                    trigger={
                                        <Tooltip title={section.description}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    backgroundColor: '#eaeaee',
                                                    color: 'black',
                                                    width: '100%',
                                                    marginBottom: 2
                                                }}
                                                // startIcon={<ExpandCircleDownIcon />}
                                            >
                                                <Box sx={{ display: 'flex', gap: '7px', marginLeft: '5px' }}>
                                                    <ExpandCircleDownIcon />
                                                    {section.title}
                                                </Box>
                                                <Box sx={{ marginRight: '5px' }}>
                                                    <Typography>00:00</Typography>
                                                </Box>
                                            </Button>
                                        </Tooltip>
                                    }
                                >
                                    <Box className={styles.sectionContent}>
                                        {section.lessons?.map((lesson, index) => (
                                            <Link href={`/instructor-dashboard/addLessonContent/${lesson.id}`}>
                                                <Box key={index} className={styles.lessonContainer}>
                                                    <Typography>{lesson.title}</Typography>
                                                    <Typography>00:00</Typography>
                                                </Box>
                                            </Link>
                                        ))}

                                        <Tooltip title="add new lesson">
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                sx={{
                                                    margin: '5px auto 10px auto',
                                                    textAlign: 'center',
                                                    fontSize: '12px'
                                                }}
                                                onClick={() => {
                                                    handleAddLesson(Number(section.id));
                                                }}
                                            >
                                                <AddIcon />
                                            </Button>
                                        </Tooltip>
                                    </Box>
                                </Collapsible>
                            ))}

                            <div
                                style={{
                                    margin: '10px 0',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                <Button variant="contained" color="info" onClick={handleAddSection} startIcon={<AddIcon />} sx={{}}>
                                    Add New Section
                                </Button>
                            </div>
                        </Box>
                        {openSectionDialog && <AddSectionDialog open={openSectionDialog} handleClickOpen={handleClickOpenSectionDialog} handleClose={handleCloseSectionDialog} addSection={addSection} />}
                        {openLessonDialog && <AddLessonDialog open={openLessonDialog} handleClickOpen={handleClickOpenLessonDialog} handleClose={handleCloseLessonDialog} addLesson={addLesson} sectionId={sectionId} />}
                    </Box>
                </div>
            </div>
        </div>
    );
};
