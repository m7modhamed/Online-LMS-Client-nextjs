'use client';
import { Course } from '@/app/interfaces/interfaces';
import { convertSecondsToHoursAndMinutes } from '@/app/utility/utilities';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { Tag } from 'primereact/tag';
import React, { useState } from 'react';

const EditableCourseInfoForAdmin = ({ course }: { course: Course | undefined }) => {
    return (
        <div className="col-12">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0px' }}>
                <div className="card">
                    <div>
                        <div className="surface-0">
                            <div className="font-medium text-3xl text-900 mb-3">{course?.name.toUpperCase()}</div>
                            <div className="text-500 mb-5">{course?.description.toUpperCase()}</div>
                            <ul className="list-none p-0 m-0">
                                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                    <div className="text-500 w-6 md:w-2 font-medium">Description</div>
                                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{course?.description.toUpperCase()}</div>
                                </li>
                                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                    <div className="text-500 w-6 md:w-2 font-medium">prerequisites</div>
                                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                        {course?.prerequisites?.map((prerequisite, index) => (
                                            <Chip label={prerequisite.toUpperCase()} className="mr-2" />
                                        ))}
                                    </div>
                                </li>
                                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                    <div className="text-500 w-6 md:w-2 font-medium">Status</div>
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
                                </li>
                                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                    <div className="text-500 w-6 md:w-2 font-medium">Category</div>
                                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{course?.category.name.toUpperCase()}</div>
                                </li>
                                <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                                    <div className="text-500 w-6 md:w-2 font-medium">Language</div>
                                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">{course?.language.toUpperCase()}</div>
                                </li>
                                <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                                    <div className="text-500 w-6 md:w-2 font-medium">Duration</div>
                                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">{course?.duration?.toString() === '0' ? '00 : 00' : convertSecondsToHoursAndMinutes(Number(course?.duration))}</div>
                                </li>
                                {}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditableCourseInfoForAdmin;
