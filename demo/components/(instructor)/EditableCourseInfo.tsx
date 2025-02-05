'use client'
import { CustomSession } from '@/app/interfaces/customSession';
import { Course } from '@/app/interfaces/interfaces';
import { convertSecondsToHoursAndMinutes } from '@/app/lib/utilities';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { Tag } from 'primereact/tag';
import React from 'react';

const EditableCourseInfo = ({ course }: { course: Course | undefined }) => {
    const t = useTranslations('editableCoursePage'); // Access translation keys
    const { data, status } = useSession() as { data: CustomSession, status: string };
    if (!data) {
        return;
    }
    const courseInfo = (
        <div className="card">
            <div>
                <div className="surface-0 p-4">
                    <div className="font-medium text-3xl text-900 mb-3">{course?.name?.toUpperCase()}</div>
                    <div className="text-500 mb-5">{course?.description.toUpperCase()}</div>
                    <ul className="list-none p-0 m-0">
                        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                            <div className="text-500 w-6 md:w-2 font-medium">{t('description')}</div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{course?.description.toUpperCase()}</div>
                            <div className="w-6 md:w-2 flex justify-content-end">
                                {data.user?.role === 'ROLE_INSTRUCTOR' &&

                                    <Button label={t('edit')} icon="pi pi-pencil" className="p-button-text" />
                                }
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                            <div className="text-500 w-6 md:w-2 font-medium">{t('prerequisites')}</div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {course?.prerequisites?.map((prerequisite, index) => (
                                    <Chip key={index} label={prerequisite.toUpperCase()} className="mr-2" />
                                ))}
                            </div>
                            <div className="w-6 md:w-2 flex justify-content-end">
                                {data.user?.role === 'ROLE_INSTRUCTOR' &&

                                    <Button label={t('edit')} icon="pi pi-pencil" className="p-button-text" />
                                }
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                            <div className="text-500 w-6 md:w-2 font-medium">{t('status')}</div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                <Tag
                                    severity={
                                        course?.status === 'PUBLISHED'
                                            ? 'success'
                                            : course?.status === 'IN_REVIEW'
                                                ? 'info'
                                                : course?.status === 'DRAFT'
                                                    ? 'warning'
                                                    : course?.status === 'ARCHIVED'
                                                        ? null // Use null for "ARCHIVED"
                                                        : course?.status === 'DELETED'
                                                            ? 'danger'
                                                            : null // Use null for "DELETED"
                                    }
                                    icon={course?.status == 'PUBLISHED' ? 'pi pi-check' : ''}
                                    value={course?.status?.toUpperCase()}
                                />
                            </div>
                            <div className="w-6 md:w-2 flex justify-content-end">
                                {data.user?.role === 'ROLE_INSTRUCTOR' &&

                                    <Button label={t('edit')} icon="pi pi-pencil" className="p-button-text" />
                                }
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                            <div className="text-500 w-6 md:w-2 font-medium">{t('category')}</div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{course?.category.name.toUpperCase()}</div>
                            <div className="w-6 md:w-2 flex justify-content-end">
                                {data.user?.role === 'ROLE_INSTRUCTOR' &&

                                    <Button label={t('edit')} icon="pi pi-pencil" className="p-button-text" />
                                }
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                            <div className="text-500 w-6 md:w-2 font-medium">{t('language')}</div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">{course?.language.toUpperCase()}</div>
                            <div className="w-6 md:w-2 flex justify-content-end">
                                {data.user?.role === 'ROLE_INSTRUCTOR' &&

                                    <Button label={t('edit')} icon="pi pi-pencil" className="p-button-text" />
                                }
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                            <div className="text-500 w-6 md:w-2 font-medium">{t('duration')}</div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                                {course?.duration?.toString() === '0' ? '00 : 00' : convertSecondsToHoursAndMinutes(Number(course?.duration))}
                            </div>
                            <div className="w-6 md:w-2 flex justify-content-end">
                                {data.user?.role === 'ROLE_INSTRUCTOR' &&
                                    <Button label={t('edit')} icon="pi pi-pencil" className="p-button-text" />

                                }
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
    return (
        <div className="col-12 ">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0px' }}>{courseInfo}</div>
        </div>
    );
};

export default EditableCourseInfo;
