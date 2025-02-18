'use client';
import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Course } from '@/app/interfaces/interfaces';
import { useRouter } from '@/i18n/routing';
import { Toast } from 'primereact/toast';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Session } from 'next-auth/core/types';
import { isTokenValid } from '@/app/lib/jwtDecode';

const PublishSection = ({ course }: { course: Course }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { data, update } = useSession();
    const t = useTranslations('publishSection');

    const handlePublish = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (!data) {
            return;
        }
        try {
            setLoading(true);

            let session: Session | null = data;
            if (!isTokenValid(data.accessToken)) {
                console.log("Session expired x, updating...");
                session = await update();
            }
            const res = await fetch(API_ROUTES.COURSES.PUBLISH_COURSE(String(course?.id)), {
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`
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
            setTimeout(() => {
                router.push('/dashboard/admin/courses');
            }, 1000);
        } catch (err: any) {
            showError('Error', err?.message);
        } finally {
            setLoading(false);
        }
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
                    <h4 className='my-6'>{t('title')}</h4>
                    <Button className='w-2 ' loading={loading} label={t('publishButtonLabel')} severity="success" onClick={handlePublish} />
                </div>
            </div>
        </div>
    );
};

export default PublishSection;
