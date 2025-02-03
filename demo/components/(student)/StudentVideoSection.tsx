'use client';
import { useEffect, useState } from 'react';
import { Box, Typography, IconButton, List, ListItem, ListItemText, Paper, Divider } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Lesson } from '@/app/interfaces/interfaces';
import { Tooltip } from 'primereact/tooltip';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { useSession } from 'next-auth/react';
import Loading from '@/app/loading';
import { CustomSession } from '@/app/interfaces/customSession';

const StudentVideoSection = ({ lessonId, studentId }: { lessonId: string; studentId: string | undefined}) => {
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [additionalFiles, setAdditionalFiles] = useState<{ name: string; url: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { data, status } = useSession() as { data: CustomSession; status: string };

    useEffect(() => {
        const fetchLesson = async () => {
            setLoading(true);
            setError(null);
            if(!studentId){
                return ;
            }
            try {
                const res = await fetch(API_ROUTES.LESSONS.GET_STUDENT_LESSON(lessonId, studentId), {
                    headers: {
                        Authorization: `Bearer ${data?.accessToken}`
                    }
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Failed to fetch lesson data.');
                }

                const lessonData: Lesson = await res.json();

                if (lessonData.video?.url) {
                    setVideoPreview(lessonData.video.url);
                }

                if (lessonData.fileResource) {
                    const formattedFiles = lessonData.fileResource.map((file) => ({
                        name: file.name,
                        url: file.url.replace(/\\/g, '/')
                    }));
                    setAdditionalFiles(formattedFiles);
                }
            } catch (err: any) {
                setError(err.message || 'An unknown error occurred.');
            } finally {
                setLoading(false);
            }
        };

        if (data?.accessToken) {
            fetchLesson();
        }
    }, [lessonId, studentId, data?.accessToken]);

    if (loading || status === 'loading') {
        return <Loading />;
    }

    if (error) {
        return (
            <Box
                sx={{
                    padding: '20px',
                    maxWidth: '800px',
                    margin: '0 auto',
                    textAlign: 'center'
                }}
            >
                <Typography variant="h5" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, marginBottom: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Lesson Video
                </Typography>

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

            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Download Files
                </Typography>

                <Divider sx={{ marginY: 2 }} />

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
