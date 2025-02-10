'use client';
import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, List, ListItem, ListItemText, Paper, Divider } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { useSession } from 'next-auth/react';
import { Tooltip } from 'primereact/tooltip';
import Loading from '@/app/loading';
import { useParams } from 'next/navigation';
import { IFile } from '@/app/interfaces/interfaces';
import { useTranslations } from 'next-intl';

const LessonContent = () => {
    const { data, status } = useSession();
    const [lesson, setLesson] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { courseId, lessonId }: { courseId: string, lessonId: string } = useParams();
    const t = useTranslations('adminLesson');

    useEffect(() => {

        const fetchLesson = async () => {
            if (!data) {
                return;
            }
            const res = await fetch(API_ROUTES.LESSONS.GET_LESSON(lessonId), {
                headers: {
                    Authorization: `Bearer ${data?.accessToken}`
                },
                cache: 'no-store'
            });

            if (!res.ok) {
                const err = await res.json();
                setLoading(false);
                throw new Error(err.message || 'fail to fetch lesson');
            }

            const lessonData = await res.json();
            setLesson(lessonData);
            setLoading(false);

        };

        fetchLesson();
    }, [status, data, lessonId]);

    if (loading || status === 'loading') {
        return <Loading />;
    }


    if (!lesson) {
        return <h5 className='card'>No lesson data found.</h5>;
    }

    let additionalFiles: IFile[] | null = null;
    if (lesson && lesson.fileResource) {
        const formattedFiles = lesson.fileResource.map((file: any) => ({
            ...file,
            url: file.url.replace(/\\/g, '/')
        }));
        additionalFiles = formattedFiles;
    }

    const videoPreview = lesson?.video?.url;

    const handleDownload = (url: string, fileName: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName; // File will be downloaded with the specified file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-4">
            {/* Lesson Title */}
            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, marginBottom: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {lesson?.title}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    {t('lessonContent')}
                </Typography>
            </Paper>

            {/* Video Preview */}
            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, marginBottom: 4 }}>
                <Typography variant="h5" gutterBottom>
                    {t('video')}
                </Typography>

                {videoPreview && (
                    <Box sx={{ marginTop: 2 }}>
                        <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 1, fontStyle: 'italic' }}>
                            {t('videoPreview')}
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

            {/* Course Files Section */}
            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>
                    {t('courseFiles')}
                </Typography>

                <Divider sx={{ marginY: 2 }} />

                <List className="mx-4">
                    {additionalFiles?.map((file, index) => (
                        <a
                            href={file?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={index}
                            className="target-icon"
                            data-pr-tooltip={t('download')}
                        >
                            <ListItem
                                sx={{
                                    background: '#f9f9f9',
                                    borderRadius: 2,
                                    marginBottom: 1,
                                    boxShadow: '0px 2px 5px rgba(0,0,0,0.1)'
                                }}
                                secondaryAction={
                                    <div>
                                        <Tooltip target=".target-icon" />
                                        <IconButton
                                            edge="end"
                                            onClick={(e) => {
                                                e.preventDefault(); // Prevents the link from opening
                                                handleDownload(file.url, file.name); // Triggers the download
                                            }}
                                        >
                                            <AttachFileIcon color="primary" />
                                        </IconButton>
                                    </div>
                                }
                            >
                                <ListItemText primary={file.name} />
                            </ListItem>
                        </a>
                    ))}
                </List>
            </Paper>
        </div>
    );
};

export default LessonContent;
