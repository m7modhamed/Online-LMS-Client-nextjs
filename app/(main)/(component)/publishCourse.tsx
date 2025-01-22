'use client';
import React, { useRef, useState } from 'react';
import { DeleteDialog } from './DeleteDialog';
import { Toast } from 'primereact/toast';
import { Course } from '@/app/interfaces/interfaces';
import { archiveCourse, deleteCourse, publishRequest } from '@/demo/service/CourseServices';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';

const PublishCourse = ({ course }: { course: Course | undefined }) => {
    const [loading, setLoading] = useState(false);
    const [displayConfirmation, setDisplayConfirmation] = useState(false);
    const router = useRouter();
    const toast = useRef<Toast>(null);

    const showSuccess = (title: string, desc: string) => {
        toast.current?.show({
            severity: 'success',
            summary: title,
            detail: desc,
            life: 5000
        });
    };

    const showError = (title: string, desc: string) => {
        toast.current?.show({
            severity: 'error',
            summary: title,
            detail: desc,
            life: 5000
        });
    };

    const handlePublish = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setLoading(true);
        const response = publishRequest(Number(course?.id));

        response
            .then((res) => {
                showSuccess('Success', res);
                router.refresh();
            })
            .catch((err) => {
                showError('Error', err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleArchive = () => {
        setLoading(true);
        const response = archiveCourse(Number(course?.id));

        response
            .then((res) => {
                showSuccess('Success', res);
                router.refresh();
            })
            .catch((err) => {
                showError('Error', err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDelete = () => {
        setLoading(true);
        const response = deleteCourse(Number(course?.id));

        response
            .then((res) => {
                showSuccess('Success', res);
                router.refresh();

                //router.push('/dashboard/instructor/courses')
            })
            .catch((err) => {
                showError('Error', err.message);
            })
            .finally(() => {
                setLoading(false);
                setDisplayConfirmation(false);
            });
    };

    return (
        <div className="card w-full">
            <Toast ref={toast} />
            <DeleteDialog displayConfirmation={displayConfirmation} setDisplayConfirmation={setDisplayConfirmation} deleteAction={handleDelete} />
            <div className="flex flex-column p-4">
                <h4 className="mb-4">After uploading the lessons and content, you can request to publish your course:</h4>

                <div className="flex gap-3 mb-4 justify-content-between">
                    {/* Render "Publish" button only if course status is 'DRAFT' */}
                   <>
                    {course?.status === 'DRAFT' && (
                        <Button
                            label="Publish"
                            icon="pi pi-upload"
                            onClick={handlePublish}
                            loading={loading}
                            severity="success"
                            className="w-16rem" // Adjust width as per your design requirements
                        />
                    )}

                    {/* Render "Archive" and "Delete" buttons based on course status */}
                    {course?.status === 'PUBLISHED' && <Button label="Archive" icon="pi pi-home" onClick={handleArchive} loading={loading} severity="help" className="w-16rem" />}
                    </>
                    {<Button label="Delete" icon="pi pi-trash" onClick={() => setDisplayConfirmation(true)} loading={loading} severity="danger" className="w-16rem" />}
                </div>
            </div>
        </div>
    );
};

export default PublishCourse;
