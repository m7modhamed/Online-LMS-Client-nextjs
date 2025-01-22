'use client';
import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Course } from '@/app/interfaces/interfaces';
import { ApprovePublishRequest } from '@/demo/service/CourseServices';
import { useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';

const PublishSection = ({ course }: { course: Course }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const handlePublish = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setLoading(true);
        const response = ApprovePublishRequest(Number(course?.id));

        response
            .then((res) => {
                //showSuccess('Success', res);
                showSuccess('Success', res);
                setTimeout(() => {
                    router.refresh();
                }, 3000);
            })
            .catch((err) => {
                showError('Error', err.message);
                // showError('Error', err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

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
    return (
        <div className="col-12">
            <Toast ref={toast} />

            <div className="publish-section">
                <div className="card">
                    <h4>Review the course, and approve the request for publishing.</h4>
                    <Button loading={loading} label="Publish" severity="success" onClick={handlePublish} />
                </div>
            </div>
        </div>
    );
};

export default PublishSection;
