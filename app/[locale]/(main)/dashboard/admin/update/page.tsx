'use client'
import { CustomSession } from '@/app/interfaces/customSession';
import Loading from '@/app/loading';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import React, { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone';

const updateUserPage = () => {

    const t = useTranslations();


    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            // setCoverImage(acceptedFiles[0]);
            // setCourseDataError({ ...courseDataError, coverImage: '' });
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        maxSize: 5000000
    });

    return (
        <div >
            <div className='card'>
                <div style={{ margin: '0 100px' }}>

                    <div style={{ textAlign: 'center', margin: '30px 0' }}>
                        <div {...getRootProps()} className="upload-container" style={{ border: '2px dashed #ccc', borderRadius: '100px', width: '150px', height: '150px', padding: '20px', cursor: 'pointer', margin: '20px auto' }}>
                            <input {...getInputProps()} />
                            {/* <p>{t('uploadInstructions')}</p> */}
                        </div>
                        <label className='pi pi-pencil' htmlFor="photo">{('coursePhoto')}</label>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: ' 1fr 1fr',
                        gap: '1.5rem'
                    }} className=''>
                        {/* First Name */}
                        <div className="mb-1" style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="firstName" className="block text-900 text-xl font-medium mb-2">
                                {t('businessSignup.firstName')}
                            </label>
                            <InputText
                                id="firstName"
                                name="firstName"
                                placeholder={t('businessSignup.firstName')}
                                className={`w-full mb-2 p-inputtext-sm`}
                            />
                        </div>

                        {/* Last Name */}
                        <div className="mb-1" style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="lastName" className="block text-900 text-xl font-medium mb-2">
                                {t('businessSignup.lastName')}
                            </label>
                            <InputText id="lastName" name="lastName" placeholder={t('businessSignup.lastName')} className={`w-full mb-2 p-inputtext-sm `} />
                        </div>


                        {/* Phone Number */}
                        <div className="mb-1" style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="phoneNumber" className="block text-900 text-xl font-medium mb-2">
                                {t('businessSignup.phoneNumber')}
                            </label>
                            <InputText
                                id="phoneNumber"
                                name="phoneNumber"
                                placeholder={t('businessSignup.phoneNumber')}
                                className={`w-full mb-2 p-inputtext-sm`}
                            />

                        </div>

                        
                                < div className="mb-1" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label htmlFor="specialization" className="block text-900 text-xl font-medium mb-2">
                                        {t('businessSignup.specialization')}
                                    </label>
                                    <InputText
                                        id="specialization"
                                        name="specialization"
                                        placeholder={t('businessSignup.specialization')}
                                        className={`w-full mb-2 p-inputtext-sm`}
                                    />
                                </div>


                                <div className="mb-1" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label htmlFor="aboutMe" className="block text-900 text-xl font-medium mb-2">
                                        {t('businessSignup.aboutMe')}
                                    </label>
                                    <InputText id="aboutMe" name="aboutMe" placeholder={t('businessSignup.aboutMe')} className={`w-full mb-2 p-inputtext-sm `} />
                                </div>

                                {/* LinkedIn URL */}
                                <div className="mb-1" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label htmlFor="linkedinUrl" className="block text-900 text-xl font-medium mb-2">
                                        {t('businessSignup.linkedinUrl')}
                                    </label>
                                    <InputText
                                        id="linkedinUrl"
                                        name="linkedinUrl"
                                        placeholder={t('businessSignup.linkedinUrl')}
                                        className={`w-full mb-2 p-inputtext-sm `}
                                    />
                                </div>

                                {/* Github URL */}
                                <div className="mb-1" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label htmlFor="githubUrl" className="block text-900 text-xl font-medium mb-2">
                                        {t('businessSignup.githubUrl')}
                                    </label>
                                    <InputText
                                        id="githubUrl"
                                        name="githubUrl"
                                        placeholder={t('businessSignup.githubUrl')}
                                        className={`w-full mb-2 p-inputtext-sm `}
                                    />
                                </div>

                                {/* Facebook URL */}
                                <div className="mb-1" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label htmlFor="facebookUrl" className="block text-900 text-xl font-medium mb-2">
                                        {t('businessSignup.facebookUrl')}
                                    </label>
                                    <InputText
                                        id="facebookUrl"
                                        name="facebookUrl"
                                        placeholder={t('businessSignup.facebookUrl')}
                                        className={`w-full mb-2 p-inputtext-sm `}
                                    />
                                </div>

                                {/* Twitter URL */}
                                <div className="mb-1" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label htmlFor="twitterUrl" className="block text-900 text-xl font-medium mb-2">
                                        {t('businessSignup.twitterUrl')}
                                    </label>
                                    <InputText
                                        id="twitterUrl"
                                        name="twitterUrl"
                                        placeholder={t('businessSignup.twitterUrl')}
                                        className={`w-full mb-2 p-inputtext-sm `}
                                    />
                                </div>
                         


                    </div>
                    <div className='flex m-5'>
                        <Button label={t('businessSignup.createAccount')} icon="pi pi-user-plus" className="w-4 m-auto p-button-lg p-button-rounded" disabled={false} />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default updateUserPage