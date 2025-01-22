'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Button, Typography, IconButton, List, ListItem, ListItemText, Paper, Divider, CircularProgress, Dialog } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { addFiles, addVideo, getLesson, deleteVideo, deleteFile } from '@/demo/service/CourseServices';
import { Lesson } from '@/app/interfaces/interfaces';
import { Toast } from 'primereact/toast';
import { DeleteDialog } from '@/app/(main)/(component)/DeleteDialog';
import { Tooltip } from 'primereact/tooltip';

const LessonContent = () => {
    const param = useParams();
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [isSavingVideo, setIsSavingVideo] = useState<boolean>(false);
    const [isSavingFiles, setIsSavingFiles] = useState<boolean>(false);
    const [isVideoUploaded, setIsVideoUploaded] = useState<boolean>(false);
    const [fileToDelete, setFileToDelete] = useState<File | null>(null);
    const [displayConfirmation, setDisplayConfirmation] = useState(false);

    useEffect(() => {
        const fetchLesson = async () => {
            if (param.lessonId) {
                try {
                    const lessonData: Lesson = await getLesson(Number(param.lessonId));
                    setLesson(lessonData);

                    // Check if the lesson has a video URL and update the videoPreview state
                    if (lessonData.video?.url) {
                        setVideoPreview(lessonData.video.url);
                        setIsVideoUploaded(true); // Video has been fetched, so mark it as uploaded
                    }

                    // Set file resources from the fetched lesson data
                    if (lessonData.fileResource) {
                        const formattedFiles = lessonData.fileResource.map((file) => ({
                            ...file,
                            url: file.url.replace(/\\/g, '/')
                        }));
                        setAdditionalFiles(formattedFiles);
                    }
                } catch (error) {
                    console.error('Error fetching lesson:', error);
                }
            }
        };
        fetchLesson();
    }, [param.lessonId]);

    // Handle video upload
    const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file)); // Generate preview URL for the video
            setIsVideoUploaded(false); // Mark as new video (not uploaded yet)
        }
    };

    // Handle additional files upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        console.log(files);
        if (files) {
            setAdditionalFiles([...additionalFiles, ...Array.from(files)]);
            event.target.value = ''; // Clear the input value
        }
    };
    console.log('additionalFiles', additionalFiles);
    // Save Video function (replace with your actual API request)
    const saveVideo = async () => {
        if (!videoFile) {
            showError('Error', 'No video selected to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', videoFile);

        try {
            setIsSavingVideo(true); // Set loading to true
            await addVideo(Number(param.lessonId), formData);
            showSuccess('success', 'Video uploaded successfully!');
            setIsVideoUploaded(true); // Mark as uploaded
        } catch (error) {
            console.error('Error uploading video:', error);
            showError('error', 'Failed to upload video.');
        } finally {
            setIsSavingVideo(false); // Set loading to false
        }
    };

    // Save Files function (replace with your actual API request)
    const saveFiles = async () => {
        const validFiles = additionalFiles.filter((file) => file instanceof File);

        if (validFiles.length === 0) {
            showError('error', 'No files selected to upload.');
            return;
        }

        const uploadPromises = validFiles.map((file) => {
            const formData = new FormData();
            formData.append('files', file);
            return addFiles(Number(param.lessonId), formData);
        });

        try {
            await Promise.all(uploadPromises);
            showSuccess('success', 'Files uploaded successfully!');
        } catch (error) {
            console.error('Error uploading files:', error);
            showError('error', 'Failed to upload files.');
        }
    };

    // Delete Video function
    const deleteLessonVideo = async () => {
        // Clear video URL from state to remove it locally
        setVideoPreview(null);
        setIsVideoUploaded(false); // Mark video as deleted
        setVideoFile(null);
        try {
            await deleteVideo(Number(param.lessonId)); // Call deleteVideo API to delete the video
            showSuccess('success', 'Video deleted successfully!');
        } catch (error) {
            console.error('Error deleting video:', error);
            showError('error', 'Failed to delete video. Please try again.');
        }

        setDisplayConfirmation(false);
    };

    const toast = useRef<Toast>(null);

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
        setFileToDelete(file); // Set the file to be deleted
        setDisplayConfirmation(true); // Show the confirmation dialog
    };

    const deleteConfirmedFile = () => {
        if (fileToDelete) {
            setAdditionalFiles(additionalFiles.filter((file) => file !== fileToDelete)); // Remove the file from state
            setFileToDelete(null); // Clear the file to delete
            setDisplayConfirmation(false); // Hide the confirmation dialog
            if (fileToDelete.id) {
                deleteFile(Number(param.lessonId), fileToDelete?.id);
            }
        }
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Toast ref={toast} />

            {fileToDelete ? (
                <DeleteDialog
                    displayConfirmation={displayConfirmation}
                    setDisplayConfirmation={setDisplayConfirmation}
                    deleteAction={deleteConfirmedFile} // Pass the deleteConfirmedFile function
                />
            ) : (
                <DeleteDialog
                    displayConfirmation={displayConfirmation}
                    setDisplayConfirmation={setDisplayConfirmation}
                    deleteAction={deleteLessonVideo} // Pass the deleteConfirmedFile function
                />
            )}

            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, marginBottom: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {lesson?.title}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    Upload Lesson Content
                </Typography>
            </Paper>

            {/* Video Upload Section */}
            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, marginBottom: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Upload Video
                </Typography>

                {/* If a video is previewed, show video preview and delete button */}
                {videoPreview ? (
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
                        {/* Show Delete button only if video is fetched or uploaded */}
                        {isVideoUploaded && (
                            <Box sx={{ marginTop: 2 }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => {
                                        setDisplayConfirmation(true);
                                    }}
                                    startIcon={<DeleteIcon />}
                                >
                                    Delete Video
                                </Button>
                            </Box>
                        )}
                    </Box>
                ) : (
                    // Show the "Add Video" button if no video is previewed
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
                                background: 'linear-gradient(45deg, #1976D2, #1E88E5)'
                            }
                        }}
                    >
                        Select Video
                        <input type="file" hidden accept="video/*" onChange={handleVideoUpload} />
                    </Button>
                )}

                {/* If a new video is uploaded but not saved yet, show the "Save Video" button */}
                {videoFile && !isVideoUploaded && !isSavingVideo && (
                    <Box sx={{ marginTop: 2 }}>
                        <Button variant="contained" color="primary" onClick={saveVideo} startIcon={<CloudUploadIcon />} disabled={isSavingVideo}>
                            {isSavingVideo ? <CircularProgress size={24} sx={{ color: 'white', marginRight: 1 }} /> : 'Save Video'}
                        </Button>
                    </Box>
                )}
            </Paper>

            {/* Additional Files Upload Section */}
            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Upload Additional Files
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
                            backgroundColor: 'rgba(255, 64, 129, 0.1)',
                            borderColor: '#F50057'
                        }
                    }}
                >
                    Select Files
                    <input type="file" hidden multiple onChange={handleFileUpload} />
                </Button>

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

                                    <IconButton className="target-icon" data-pr-tooltip="delete file" edge="end" onClick={() => confirmDeleteFile(file)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>

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

                {/* <List>
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
                                <IconButton edge="end" onClick={() => confirmDeleteFile(file)}>
                                    <DeleteIcon color="error" />
                                </IconButton>
                            }
                        >
                            <AttachFileIcon sx={{ marginRight: 2 }} color="action" />
                            <ListItemText primary={file.name} />
                        </ListItem>
                    ))}
                </List> */}

                {additionalFiles.length > 0 && (
                    <Box sx={{ marginTop: 2 }}>
                        <Button variant="contained" color="secondary" onClick={saveFiles} startIcon={<AttachFileIcon />} disabled={isSavingFiles}>
                            {isSavingFiles ? <CircularProgress size={24} sx={{ color: 'white', marginRight: 1 }} /> : 'Save Files'}
                        </Button>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default LessonContent;
