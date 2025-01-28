'use client';
import { CustomSession } from '@/app/interfaces/customSession';
import { enrollCourse } from '@/demo/service/CourseServices';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';

const EnrollCourse = ({ courseId }: { courseId: Number }) => {
    const { data, status } = useSession() as { data: CustomSession; status: string };
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    console.log('data here : ', data);
    if (status === 'loading') {
        return;
    }
    const handleEnrollButton = async () => {
        try {
            setLoading(true);
            const response = await enrollCourse(courseId, Number(data?.user?.id));

            showSuccess('Success', response);

            router.refresh();
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
        <div className="mt-6 w-full">
            <Toast ref={toast} />

            <h6 style={{ wordSpacing: '2px', lineHeight: '25px' }}>
                This course offers valuable insights and hands-on experience in the field. Don't miss the chance to level up your skills and advance your career. Enroll now to start your learning journey!
            </h6>
            <Button style={{ width: '50%' }} loading={loading} className="block mx-auto my-4" label="Enroll Now!" severity="success" onClick={handleEnrollButton} />
        </div>
    );
};

export default EnrollCourse;
