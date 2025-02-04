'use client';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { CustomSession } from '@/app/interfaces/customSession';
import { Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';

const EnrollCourse = ({ courseId }: { courseId: string }) => {
    const { data, status } = useSession() as { data: CustomSession; status: string };
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const t = useTranslations('enrollCourse');


    if (status === 'loading') {
        return;
    }

    const handleEnrollButton = async () => {
        try {
            setLoading(true);
            //const response = await enrollCourse(courseId, Number(data?.user?.id));
            if (!data || !data?.user?.id || !courseId) {
                return;
            }
            const res = await fetch(API_ROUTES.COURSES.ENROLL_COURSE(data.user?.id, courseId), {
                headers: {
                    Authorization: `Bearer ${data?.accessToken}`
                },
                method: "POST"
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message);
            }
            const responseMessage = await res.text();


            showSuccess('Success', responseMessage);

            router.refresh();
        } catch (err: any) {
            showError('Error', err?.message);
        } finally {
            setLoading(false);
        }
    };


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
        <div className="mt-6 w-full">
            <Toast ref={toast} />

            <Typography variant='h6' style={{ wordSpacing: '2px', lineHeight: '25px', margin: '50px 0 75px 0' }}>
                {t('enrollmentDescription')}
            </Typography>
            <Button
                style={{ width: '50%' }}
                loading={loading}
                className="block mx-auto my-4"
                label={t('enrollButton')}
                severity="success"
                onClick={handleEnrollButton}
            />

        </div>
    );
};

export default EnrollCourse;
