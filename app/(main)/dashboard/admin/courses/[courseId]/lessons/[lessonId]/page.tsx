'use client';
import { Box, Typography, IconButton, List, ListItem, ListItemText, Paper, Divider } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { getAdminCourse, getLesson } from '@/demo/service/CourseServices';
import { Course, Lesson } from '@/app/interfaces/interfaces';
import { Tooltip } from 'primereact/tooltip';

const LessonContent = async ({ params }: { params: {courseId : string , lessonId: string } }) => {
    const lesson: Lesson = await getLesson(Number(params.lessonId));
    let additionalFiles;
    if (lesson.fileResource) {
        const formattedFiles = lesson.fileResource.map((file) => ({
            ...file,
            url: file.url.replace(/\\/g, '/')
        }));
        additionalFiles = formattedFiles;
    }
    const videoPreview = lesson.video.url;

    const handleDownload = (url: string, fileName: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;  // File will be downloaded with the specified file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, marginBottom: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {lesson?.title}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    Lesson Content
                </Typography>
            </Paper>

            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, marginBottom: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Video
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
                    Course Files
                </Typography>

                <Divider sx={{ marginY: 2 }} />

                <List className="mx-4">
                    {additionalFiles?.map((file, index) => (
                        <a
                            href={file?.url} 
                            target="_blank"  // Opens the file in a new tab
                            rel="noopener noreferrer"  // Security measure for opening links in new tab
                            key={index}
                            className="target-icon"
                            data-pr-tooltip="download"
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

                                        {/* Button to trigger file download */}
                                        <IconButton 
                                            edge="end" 
                                            onClick={(e) => {
                                                e.preventDefault();  // Prevents the link from opening
                                                handleDownload(file.url, file.name);  // Triggers the download
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

        </Box>
    );
};

export default LessonContent;
