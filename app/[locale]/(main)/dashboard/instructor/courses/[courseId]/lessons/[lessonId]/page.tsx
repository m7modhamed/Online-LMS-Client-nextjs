'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Button, Typography, IconButton, List, ListItem, ListItemText, Paper, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { IFile, Lesson } from '@/app/interfaces/interfaces';
import Loading from '@/app/loading';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { Toast } from 'primereact/toast';
import { useSession } from 'next-auth/react';
import { DeleteDialog } from '@/demo/components/DeleteDialog';
import { useTranslations } from 'next-intl';
import { Session } from 'next-auth/core/types';
import { isTokenValid } from '@/app/lib/jwtDecode';

const InstructorLesson = () => {
    const toast = useRef<Toast>(null);
    const { lessonId }: { lessonId: string } = useParams();
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [isSavingVideo, setIsSavingVideo] = useState<boolean>(false);
    const [isSavingFiles, setIsSavingFiles] = useState<boolean>(false);
    const [isVideoUploaded, setIsVideoUploaded] = useState<boolean>(false);
    const [fileToDelete, setFileToDelete] = useState<File | IFile | null>(null);
    const [displayConfirmation, setDisplayConfirmation] = useState(false);
    const [loading, setLoading] = useState(true);
    const { data, status, update } = useSession();
    const t = useTranslations('instructorLesson');



    useEffect(() => {
        const fetchLesson = async () => {
            if (status === 'loading' || !data?.accessToken) return;

            try {
                const response = await fetch(API_ROUTES.LESSONS.GET_LESSON(lessonId), {
                    headers: { Authorization: `Bearer ${data.accessToken}` },
                    next: {
                        revalidate: 60
                    }
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        console.log("Session expired, updating...");
                        await update();
                        return;
                    }
                    const error = await response.json();
                    throw new Error(error.message);
                }
                const fetchedLesson = await response.json();
                setLesson(fetchedLesson);
                setVideoPreview(fetchedLesson.video?.url || null);
                setAdditionalFiles(fetchedLesson.fileResource || []);
            } catch (error: any) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchLesson();
    }, [lessonId, data, status]);

    if (loading) {
        return <Loading />;
    }
    if (!lesson) {
        return (
            <div className="card">
                <h5>No lesson found</h5>
            </div>
        );
    }


    const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
            setIsVideoUploaded(false);
        }
    };


    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setAdditionalFiles([...additionalFiles, ...Array.from(files)]);
            event.target.value = '';
        }
    };

    const saveVideo = async () => {
        if (!videoFile) {
            showError('Error', 'No video selected to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', videoFile);

        try {
            if (!data) {
                return;
            }
            let session: Session | null = data;
            if (!isTokenValid(data.accessToken)) {
                console.log("Session expired x, updating...");
                session = await update();
            }
            setIsSavingVideo(true);
            const res = await fetch(API_ROUTES.MEDIA.ADD_VIDEO(lessonId), {
                method: 'POST',
                headers: { Authorization: `Bearer ${session?.accessToken}` },
                body: formData,
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message);
            }

            const savedVideo = await res.json();
            setIsVideoUploaded(true);
            setVideoFile(null);
            setVideoPreview(savedVideo.url);

            showSuccess('success', 'Video uploaded successfully!');
        } catch (error) {
            console.error('Error uploading video:', error);
            showError('error', 'Failed to upload video.');
        } finally {
            setIsSavingVideo(false);
        }
    };


    const saveFiles = async () => {
        const validFiles = additionalFiles.filter((file) => file instanceof File);

        if (validFiles.length === 0) {
            showError('error', 'No files selected to upload.');
            return;
        }

        const formData = new FormData();
        validFiles.forEach((file) => {
            formData.append('files', file);
        });
        if (!data) {
            return;
        }

        try {
            let session: Session | null = data;
            if (!isTokenValid(data.accessToken)) {
                console.log("Session expired x, updating...");
                session = await update();
            }
            setIsSavingFiles(true);
            const res = await fetch(API_ROUTES.MEDIA.ADD_FILES(lessonId), {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
                body: formData,
            });

            if (!res.ok) {

                const error = await res.json();
                throw new Error(error.message || 'Failed to upload files');
            }


            const savedFiles = await res.json();
            console.log('savedFiles', savedFiles)
            // setAdditionalFiles((prevFiles) => [
            //     ...prevFiles,
            //     ...savedFiles,
            // ]);

            showSuccess('success', 'Files uploaded successfully!');
        } catch (error) {
            console.error('Error uploading files:', error);
            showError('error', 'Failed to upload files.');
        } finally {
            setIsSavingFiles(false);
        }
    };



    const deleteLessonVideo = async () => {
        setVideoPreview(null);
        setIsVideoUploaded(false);
        setVideoFile(null);
        if (!data) {
            return;
        }
        let session: Session | null = data;
        if (!isTokenValid(data.accessToken)) {
            console.log("Session expired x, updating...");
            session = await update();
        }
        try {
            const res = await fetch(API_ROUTES.MEDIA.DELETE_VIDEO(lessonId), {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            });
            if (!res.ok) {

                const error = await res.json();
                throw new Error(error.message || 'Failed to delete video');
            }
            const response = await res.text();
            showSuccess('Success', response);
        } catch (error: any) {
            showError('Error', error.message || 'Failed to delete video. Please try again.');
        }

        setDisplayConfirmation(false);
    };


    const showError = (title: string, desc: string) => {
        toast.current?.show({
            severity: 'error',
            summary: title,
            detail: desc,
            life: 5000
        });
    };


    const showSuccess = (title: string, desc: string) => {
        toast.current?.show({
            severity: 'success',
            summary: title,
            detail: desc,
            life: 5000
        });
    };


    const confirmDeleteFile = (file: File) => {
        setFileToDelete(file);
        setDisplayConfirmation(true);
    };

    const deleteConfirmedFile = async () => {
        if (fileToDelete) {
            setAdditionalFiles(additionalFiles.filter((file) => file !== fileToDelete));
            setFileToDelete(null);
            setDisplayConfirmation(false);
            if (!data) {
                return;
            }
            let session: Session | null = data;
            if (!isTokenValid(data.accessToken)) {
                console.log("Session expired x, updating...");
                session = await update();
            }
            if (fileToDelete && 'id' in fileToDelete) {
                const res = await fetch(API_ROUTES.MEDIA.DELETE_FILE(lessonId, String(fileToDelete?.id)), {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                });

                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.message || 'Failed to delete file');
                }
                const deleted = await res.text();
            }
        }
    };

    return (
        <div style={{ padding: 4 }}>
            <Toast ref={toast} />

            <DeleteDialog
                displayConfirmation={displayConfirmation}
                setDisplayConfirmation={setDisplayConfirmation}
                deleteAction={fileToDelete ? deleteConfirmedFile : deleteLessonVideo}
            />

            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, marginBottom: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {lesson?.title}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    {t('uploadLessonContent')}
                </Typography>
            </Paper>

            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, marginBottom: 4 }}>
                <Typography variant="h5" gutterBottom>
                    {t('uploadVideo')}
                </Typography>

                <Box sx={{ marginTop: 2 }}>
                    {videoPreview ? (
                        <>
                            <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 1, fontStyle: 'italic' }}>
                                {t('videoPreview')}
                            </Typography>
                            <video
                                controls
                                style={{
                                    width: '100%',
                                    maxHeight: '400px',
                                    borderRadius: '8px',
                                    boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                                }}
                                src={videoPreview || undefined}
                            />

                            {!videoFile && (
                                <Box sx={{ marginTop: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => setDisplayConfirmation(true)}
                                        startIcon={<DeleteIcon className='m-0' />}
                                    >
                                        {t('deleteVideo')}
                                    </Button>
                                </Box>
                            )}
                        </>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            component="label"
                            startIcon={<CloudUploadIcon />}
                            sx={{
                                background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                                color: '#fff',
                                padding: '8px 16px',
                                borderRadius: 2,
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #1976D2, #1E88E5)',
                                },
                            }}
                        >
                            {t('selectVideo')}
                            <input type="file" hidden accept="video/*" onChange={handleVideoUpload} />
                        </Button>
                    )}
                </Box>

                {videoFile && !isVideoUploaded && !isSavingVideo && (
                    <Box sx={{ marginTop: 2 }}>
                        <Button variant="contained" color="primary" onClick={saveVideo} startIcon={<CloudUploadIcon />} disabled={isSavingVideo}>
                            {isSavingVideo ? <CircularProgress size={24} sx={{ color: 'white', marginRight: 1 }} /> : t('saveVideo')}
                        </Button>
                    </Box>
                )}
            </Paper>

            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>
                    {t('uploadAdditionalFiles')}
                </Typography>
                <Button
                    variant="outlined"
                    color="secondary"
                    component="label"
                    startIcon={<AttachFileIcon />}
                    sx={{
                        padding: '8px 16px',
                        borderRadius: 2,
                        borderColor: '#FF4081',
                        color: '#FF4081',
                        '&:hover': {
                            borderColor: '#D81B60',
                        },
                    }}
                >
                    {t('selectFiles')}
                    <input type="file" hidden multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleFileUpload} />
                </Button>

                {additionalFiles.length > 0 && (
                    <Box sx={{ marginTop: 3 }}>
                        <List>
                            {additionalFiles?.map((file, index) => (

                                <ListItem
                                    className='card'
                                    key={index}
                                    secondaryAction={
                                        <IconButton edge="end" onClick={() => confirmDeleteFile(file)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >

                                    <ListItemText
                                        primary={file.name}
                                        secondary={`${t('type')} : ${file.type} `}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

                {additionalFiles.length > 0 && !isSavingFiles && (
                    <Box sx={{ marginTop: 2 }}>
                        <Button variant="contained" color="primary" onClick={saveFiles} startIcon={<CloudUploadIcon />} disabled={isSavingFiles}>
                            {isSavingFiles ? <CircularProgress size={24} sx={{ color: 'white', marginRight: 1 }} /> : t('saveFiles')}
                        </Button>
                    </Box>
                )}
            </Paper>
        </div>
    );
};

export default InstructorLesson;
