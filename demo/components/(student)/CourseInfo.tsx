'use client';
import { Course } from '@/app/interfaces/interfaces';
import { convertSecondsToHoursAndMinutes } from '@/app/utility/utilities';
import { Chip } from 'primereact/chip';
import { Tag } from 'primereact/tag';
import React from 'react';
import { useTranslations } from 'next-intl';

const CourseInfo = ({ course }: { course: Course | undefined }) => {
    const t = useTranslations('courseInfo');

    return (
        <div className="col-12">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0px' }}>
                <div className="card">
                    <div className="surface-0 p-4">
                        <div className="font-medium text-3xl text-900 mb-3">{course?.name.toUpperCase()}</div>
                        <div className="text-500 mb-5">{course?.description}</div>
                        <ul className="list-none p-0 m-0">
                            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                <div className="text-500 w-6 md:w-2 font-medium">{t('description')}</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{course?.description}</div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                <div className="text-500 w-6 md:w-2 font-medium">{t('prerequisites')}</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                    {course?.prerequisites?.map((prerequisite, index) => (
                                        <Chip key={index} label={prerequisite} className="mr-2" />
                                    ))}
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
                                                ? null
                                                : course?.status === 'DELETED'
                                                ? 'danger'
                                                : null
                                        }
                                        icon={course?.status === 'PUBLISHED' ? 'pi pi-check' : ''}
                                        value={t(`statusOptions.${course?.status}`)}
                                    />
                                </div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                <div className="text-500 w-6 md:w-2 font-medium">{t('category')}</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{course?.category.name}</div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                <div className="text-500 w-6 md:w-2 font-medium">{t('language')}</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{course?.language}</div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                <div className="text-500 w-6 md:w-2 font-medium">{t('duration')}</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                    {course?.duration?.toString() === '0'
                                        ? '00:00'
                                        : convertSecondsToHoursAndMinutes(Number(course?.duration))}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseInfo;
