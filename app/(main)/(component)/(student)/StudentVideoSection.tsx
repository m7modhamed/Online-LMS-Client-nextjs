'use client';
import { useEffect, useState } from 'react';
import { Box, Typography, IconButton, List, ListItem, ListItemText, Paper, Divider } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Lesson } from '@/app/interfaces/interfaces';
import { Tooltip } from 'primereact/tooltip';
import { getStudentLesson } from '@/demo/service/CourseServices';

const StudentVideoSection = ({ lessonId, studentId }: { lessonId: Number; studentId: Number }) => {
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null); // State to track errors

    useEffect(() => {
        const fetchLesson = async () => {
            if (lessonId) {
                try {
                    const lessonData: Lesson = await getStudentLesson(studentId, Number(lessonId));

                    // Check if the lesson has a video URL and update the videoPreview state
                    if (lessonData.video?.url) {
                        setVideoPreview(lessonData.video.url);
                    }

                    // Set file resources from the fetched lesson data
                    if (lessonData.fileResource) {
                        const formattedFiles = lessonData.fileResource.map((file) => ({
                            ...file,
                            url: file.url.replace(/\\/g, '/')
                        }));
                        setAdditionalFiles(formattedFiles);
                    }

                    setError(null); // Clear any previous error
                } catch (err: any) {
                    console.error('Error fetching lesson:', err.message);
                    setError(err?.message || 'Failed to fetch lesson'); // Set error state
                }
            }
        };
        fetchLesson();
    }, [lessonId]);

    // Render error message if an error occurred
    if (error) {
        return (
            <div className='card' sx={{ padding: '20px', textAlign: 'center' }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </div>
        );
    }

    // Render the main content
    return (
        <Box sx={{}}>
            {/* Video Upload Section */}
            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, marginBottom: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Lesson Video
                </Typography>

                {/* If a video is previewed, show video preview */}
                {videoPreview && (
                    <Box sx={{ marginTop: 2 }}>
                        <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 1, fontStyle: 'italic' }}>
                            Video Preview
                        </Typography>
                        <video
                            controls
                            style={{
                                width: '100%',
                                maxHeight: '400px',
                                borderRadius: '8px',
                                boxShadow: '0px 4px 8px rgba(0,0,0,0.2)'
                            }}
                            src={videoPreview || undefined}
                        />
                    </Box>
                )}
            </Paper>

            {/* Additional Files Upload Section */}
            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Download Files
                </Typography>

                <Divider sx={{ marginY: 2 }} />

                {/* Display the files fetched from the lesson */}
                <List>
                    {additionalFiles.map((file, index) => (
                        <ListItem
                            key={index}
                            sx={{
                                background: '#f9f9f9',
                                borderRadius: 2,
                                marginBottom: 1,
                                boxShadow: '0px 2px 5px rgba(0,0,0,0.1)'
                            }}
                            secondaryAction={
                                <>
                                    <Tooltip target=".target-icon" />
                                    <a href={file.url} download={file.name} className="target-icon" data-pr-tooltip="download">
                                        <IconButton edge="end">
                                            <AttachFileIcon color="primary" />
                                        </IconButton>
                                    </a>
                                </>
                            }
                        >
                            <ListItemText primary={file.name} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default StudentVideoSection;
