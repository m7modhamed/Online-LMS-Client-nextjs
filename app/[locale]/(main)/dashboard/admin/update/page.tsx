'use client'
import { API_ROUTES } from '@/app/api/apiRoutes';
import { IBusinessSignUpError, ISignup, ISignupError } from '@/app/interfaces/interfaces';
import { getImageUrl, urlToFile } from '@/app/lib/utilities';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Message } from 'primereact/message';
import React, { useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone';
import { Toast } from 'primereact/toast';
import { UpdateValidationSchema } from '../../instructor/update/ValidationSchema';
import Loading from '@/app/loading';
import { useRouter } from '@/i18n/routing';

const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    profileImage: undefined

};


const UpdateUserPage = () => {

    const t = useTranslations("profileUpdate");
    const [adminInfo, setAdminInfo] = useState<ISignup>(initialState);
    const [formDataError, setFormDataError] = useState<ISignupError>(initialState);
    const [errorMessage, setErrorMessage] = useState('');
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const [existChange, setExistChange] = useState(false);
    const { data, status, update } = useSession();
    const router = useRouter();



    useEffect(() => {
        const fetchAdminData = async () => {
            if (!data || !data?.user?.id) {
                return;
            }

            const res = await fetch(API_ROUTES.USERS.GET_ADMIN_INFO(data.user?.id), {
                headers: {
                    Authorization: `Bearer ${data.accessToken}`
                }
            })


            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message);
            }

            const response: ISignup = await res.json();
            setAdminInfo(response)
            const imageUrl = response?.profileImage?.imageUrl;
            const imageName = response?.profileImage?.name;
            if (imageUrl) {
                const imageUrlToUpload = imageUrl.includes('public') ? getImageUrl(imageUrl) : imageUrl;


                await urlToFile(imageUrlToUpload, imageName || 'img').then((res) => {
                    setProfileImage(res)
                }).catch((err) => {
                    console.log('Error converting URL to File', err)
                    setFormDataError({ ...formDataError, 'profileImage': err })
                })

            }
        }
        fetchAdminData();

    }, [data])



    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setProfileImage(acceptedFiles[0]);
            setFormDataError({ ...formDataError, profileImage: '' });
            setExistChange(true);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        maxSize: 5000000
    });


    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        //reset error message
        setErrorMessage('');

        const { name, value } = event.target;

        setAdminInfo((prevUserData) => {
            const updatedUserData = { ...prevUserData, [name]: value };

            // Validate the field on change using Yup schema
            UpdateValidationSchema.validateAt(name, updatedUserData)
                .then(() => {
                    setFormDataError((prevFormDataError) => ({
                        ...prevFormDataError,
                        [name]: ''
                    }));
                })
                .catch((err) => {
                    setFormDataError((prevFormDataError) => ({
                        ...prevFormDataError,
                        [name]: err.message
                    }));
                });
            setExistChange(true);
            return updatedUserData;
        });
    };


    const handleUpdateClick = async () => {

        if (errorMessage || !data) {
            return;
        }
        setErrorMessage('');
        setIsLoading(true);
        try {
            // Validate using Yup schema
            await UpdateValidationSchema.validate(adminInfo, {
                abortEarly: false
            });
            const formData = new FormData();

            const courseBlob = new Blob([JSON.stringify(adminInfo)], { type: 'application/json' });

            formData.append('adminInfo', courseBlob);
            if (profileImage) {
                formData.append('image', profileImage);
            }
            // Call API if validation passes
            const res = await fetch(API_ROUTES.USERS.UPDATE_ADMIN_INFO(data.user?.id), {
                headers: {
                    Authorization: `Bearer ${data.accessToken}`
                },
                method: "PUT",
                body: formData
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message);
            }
            const response = await res.json();


            await update(
                {
                    ...data,
                    user: {
                        ...data.user,
                        firstName: response.firstName,
                        lastName: response.lastName,
                        image: response.profileImage.imageUrl
                    }

                }
            );

            setTimeout(() => {
                showSuccess('update successful', "Profile updated successfully");
            }, 0)

            //resetForm();
        } catch (error: any) {

            // If it's a Yup validation error
            if (error.name === 'ValidationError') {
                const errors: IBusinessSignUpError = {};
                error.inner.forEach((err: any) => {
                    if (err.path) {
                        errors[err.path as keyof IBusinessSignUpError] = err.message;
                    }
                });
                setFormDataError(errors);
            } else {
                // Handle server-side errors
                try {
                    const errorObj = JSON.parse(error.message);
                    if (typeof errorObj === 'object' && errorObj !== null) {
                        setFormDataError(errorObj);
                    }
                } catch (parseError) {
                    setErrorMessage(error.message);
                    showError('Error', error.message);
                }
            }
        } finally {
            setIsLoading(false);
            setExistChange(false);
        }
    }

    const showError = (title: string, desc: string) => {
        toast.current?.show({
            severity: 'error',
            summary: title,
            detail: desc,
            life: 5000
        });
    };
    const showSuccess = (title: string, desc: string) => {
        toast.current?.show({
            severity: 'success',
            summary: title,
            detail: desc,
            life: 5000
        });
    };


    if (status === 'loading') {
        return <Loading />
    }


    return (
        <div >
            <Toast ref={toast} />

            <div className='card'>
                <div style={{ margin: '0 100px' }}>

                    <div style={{ textAlign: 'center', margin: '15px 0 30px 0' }}>

                        {(
                            <div className="mt-2" style={{ border: '2px dashed #ccc', borderRadius: '100px', width: '155px', height: '155px', cursor: 'pointer', margin: '20px auto' }}>
                                <div {...getRootProps()} className="upload-container" >
                                    <input {...getInputProps()} />
                                    {profileImage &&
                                        <Avatar image={URL.createObjectURL(profileImage)} style={{ width: '150px', height: '150px' }} size="xlarge" shape="circle" />

                                    }

                                </div>


                            </div>

                        )}
                        <label className='pi pi-pencil' htmlFor="photo">{t('profilePhoto')}</label>

                        {formDataError.profileImage && <Message style={{ marginTop: '10px' }} severity="error" text={formDataError.profileImage} />}
                    </div>


                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: ' 1fr 1fr',
                        gap: '1.5rem'
                    }} >


                        {/* First Name */}
                        <div className="mb-1" style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="firstName" className="block text-900 text-xl font-medium mb-2">
                                {t('firstName')}
                            </label>
                            <InputText
                                id="firstName"
                                name="firstName"
                                value={adminInfo.firstName}
                                onChange={onChangeHandler}
                                placeholder={t('firstName')}
                                className={`w-full mb-2 text-800 text-xl`}
                            />
                            {formDataError.firstName && <Message severity="error" text={formDataError.firstName} />}

                        </div>

                        {/* Last Name */}
                        <div className="mb-1" style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="lastName" className="block text-900 text-xl font-medium mb-2">
                                {t('lastName')}
                            </label>
                            <InputText id="lastName" name="lastName"
                                value={adminInfo.lastName}
                                onChange={onChangeHandler}
                                placeholder={t('lastName')} className={`w-full mb-2 text-800 text-xl `} />
                            {formDataError.lastName && <Message severity="error" text={formDataError.lastName} />}

                        </div>



                        {/* Email */}
                        <div className="mb-1" style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                                {t('email')}
                            </label>
                            <InputText id="email" name="email"
                                value={adminInfo.email}
                                onChange={onChangeHandler}
                                placeholder={t('email')} className={`w-full mb-2 text-800 text-xl `} disabled={true} />
                            {formDataError.email && <Message severity="error" text={formDataError.email} />}

                        </div>

                        {/* Phone Number */}
                        <div className="mb-1" style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="phoneNumber" className="block text-900 text-xl font-medium mb-2">
                                {t('phoneNumber')}
                            </label>
                            <InputText
                                id="phoneNumber"
                                name="phoneNumber"
                                value={adminInfo.phoneNumber}
                                onChange={onChangeHandler}
                                placeholder={t('phoneNumber')}
                                className={`w-full mb-2 text-800 text-xl`}
                            />
                            {formDataError.phoneNumber && <Message severity="error" text={formDataError.phoneNumber} />}

                        </div>

                    </div>
                    <div className='flex m-5'>
                        <Button label={t('update')} icon="pi pi-pencil" className="w-4 m-auto p-button-lg p-button-rounded" onClick={handleUpdateClick} loading={isLoading} disabled={!existChange} />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default UpdateUserPage