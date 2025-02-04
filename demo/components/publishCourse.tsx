'use client';
import React, { useRef, useState } from 'react';
import { DeleteDialog } from './DeleteDialog';
import { Toast } from 'primereact/toast';
import { Course } from '@/app/interfaces/interfaces';
import { useRouter } from '@/i18n/routing';
import { Button } from 'primereact/button';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/interfaces/customSession';
import Loading from '@/app/loading';
import { useTranslations } from 'next-intl';

const PublishCourse = ({ course }: { course: Course | undefined }) => {
    const [loading, setLoading] = useState(false);
    const [displayConfirmation, setDisplayConfirmation] = useState(false);
    const t = useTranslations('publishCoursePage'); // Access translation keys
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const { data, status } = useSession() as { data: CustomSession; status: string };
    const showSuccess = (title: string, desc: string) => {
        toast.current?.show({
            severity: 'success',
            summary: title,
            detail: desc,
            life: 5000
        });
    };

    if (status === 'loading') {
        return <Loading />;
    }

    const showError = (title: string, desc: string) => {
        toast.current?.show({
            severity: 'error',
            summary: title,
            detail: desc,
            life: 5000
        });
    };

    const handlePublish = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setLoading(true);

        try {
            setLoading(true);

            const res = await fetch(API_ROUTES.COURSES.PUBLISH_COURSE_REQUEST(String(course?.id)), {
                headers: {
                    Authorization: `Bearer ${data.accessToken}`
                },
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message);
            }

            const result = await res.text();
            showSuccess('Success', result);
            router.push('/dashboard/instructor/courses/')

        } catch (err: any) {
            showError('Error', err?.message);
        } finally {
            setLoading(false);
        }
    };

    const handleArchive = async () => {
        setLoading(true);

        try {
            setLoading(true);

            const res = await fetch(API_ROUTES.COURSES.ARCHIVE_COURSE(String(course?.id)), {
                headers: {
                    Authorization: `Bearer ${data.accessToken}`
                }
            });

            if (!res.ok) {
                const error = await res.json();
                console.log(error);
                throw new Error(error.message);
            }

            const result = await res.text();

            showSuccess('Success', result);
            router.refresh();
        } catch (err: any) {
            showError('Error', err?.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            const res = await fetch(API_ROUTES.COURSES.DELETE_COURSE(String(course?.id)), {
                headers: {
                    Authorization: `Bearer ${data.accessToken}`
                },
                method: 'DELETE'
            });
            console.log('res', res);
            if (!res.ok) {
                const error = await res.json();
                console.log(error);
                throw new Error(error.message);
            }

            const result = await res.text();
            showSuccess('Success', result);
            router.push('/dashboard/instructor/courses');
        } catch (err: any) {
            showError('Error', err?.message);
        } finally {
            setLoading(false);
            setDisplayConfirmation(false);
        }
    };

    return (
        <div className="card w-full">
            <Toast ref={toast} />
            <DeleteDialog displayConfirmation={displayConfirmation} setDisplayConfirmation={setDisplayConfirmation} deleteAction={handleDelete} />
            <h4 className="mb-4">{t('afterUploadMessage')}</h4>
            <div className="flex flex-column p-4">

                <div className="flex gap-3 mb-4 justify-content-between">
                    <>
                        {course?.status === 'DRAFT' && <Button label={t('publishButton')} icon="pi pi-upload" onClick={handlePublish} loading={loading} severity="success" className="w-16rem" />}

                        {course?.status === 'PUBLISHED' && <Button label={t('archiveButton')} icon="pi pi-home" onClick={handleArchive} loading={loading} severity="help" className="w-16rem" />}
                    </>
                    <Button label={t('deleteButton')} icon="pi pi-trash" onClick={() => setDisplayConfirmation(true)} loading={loading} severity="danger" className="w-16rem" />
                </div>
            </div>
        </div>
    );
};

export default PublishCourse;
