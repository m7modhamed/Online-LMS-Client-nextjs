'use client';
import { Instructor } from '@/app/interfaces/interfaces';
import { Link } from '@/i18n/routing';
import { Avatar } from 'primereact/avatar';
import React from 'react';
import { useTranslations } from 'next-intl';
import { getImageUrl } from '@/app/lib/utilities';

const InstructorInfo = ({ instructor }: { instructor: Instructor }) => {
    const t = useTranslations('instructorInfo');

    return (
        <div className="col-12">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0px' }}>
                <div className="card">
                    <div className="surface-0 p-4">
                        <div className="flex text-center align-items-center gap-3 font-medium text-3xl text-900 mb-3">
                            <Avatar image={getImageUrl(instructor?.profileImage?.imageUrl)} size="xlarge" shape="circle" />
                            {instructor.firstName} {instructor.lastName}
                        </div>
                        <div className="text-500 mb-5">{instructor.aboutMe}</div>
                        <ul className="list-none p-0 m-0">
                            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                <div className="text-500 w-6 md:w-2 font-medium">{t('specialization')}</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                    {instructor.specialization.toUpperCase()}
                                </div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                <div className="text-500 w-6 md:w-2 font-medium">{t('socialMedia')}</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                    <div className="flex items-center justify-center gap-4 sm:w-1/4">
                                        {instructor.facebookUrl && (
                                            <Link href={instructor.facebookUrl} target="_blank">
                                                <i className="pi pi-facebook text-blue-600 hover:text-blue-700 transition-all" style={{ fontSize: '2rem' }}></i>
                                            </Link>
                                        )}
                                        {instructor.linkedinUrl && (
                                            <Link href={instructor.linkedinUrl} target="_blank">
                                                <i className="pi pi-linkedin text-blue-700 hover:text-blue-800 transition-all" style={{ fontSize: '2rem' }}></i>
                                            </Link>
                                        )}
                                        {instructor.githubUrl && (
                                            <Link href={instructor.githubUrl} target="_blank">
                                                <i className="pi pi-github text-gray-800 hover:text-gray-900 transition-all" style={{ fontSize: '2rem' }}></i>
                                            </Link>
                                        )}
                                        {instructor.twitterUrl && (
                                            <Link href={instructor.twitterUrl} target="_blank">
                                                <i className="pi pi-twitter text-blue-500 hover:text-blue-600 transition-all" style={{ fontSize: '2rem' }}></i>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                <div className="text-500 w-6 md:w-2 font-medium">{t('email')}</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{instructor.email}</div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                <div className="text-500 w-6 md:w-2 font-medium">{t('phone')}</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{instructor.phoneNumber}</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorInfo;
