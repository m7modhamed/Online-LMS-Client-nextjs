/* eslint-disable @next/next/no-img-element */
'use client';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import React, { useContext, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { SignupValidationSchema } from '../../signup/ValidationSchema';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/interfaces/customSession';

const ResetPassword = () => {
    const { token }: { token: string } = useParams(); // Extract token from the URL
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const { data, status } = useSession() as { data: CustomSession, status: string };
    const [userData, setUserData] = useState({ password: '', confirmPassword: '' });
    const [userDataError, setUserDataError] = useState({ password: '', confirmPassword: '' });
    const [isLoading, setIsLoading] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

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

    const handleSubmit = async () => {
        try {
            if (!!errorMessage || !userData.password || !token) {
                return;
            }
            setIsLoading(true);
            console.log('before')
            //const response = await resetPassword(token, userData.password);
            const res = await fetch(API_ROUTES.USERS.RESET_PASSWORD(token, userData.password), {
                headers: {
                    Authorization: `Bearer ${data.accessToken}`
                }
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error);
            }
            const response = await res.text();
            console.log(response)

            showSuccess('Success', response);
            setIsLoading(false);

            setTimeout(() => {
                router.push('/auth/login'); // Navigate to the login page
            }, 5000);
        } catch (error: any) {
            setIsLoading(false);
            setErrorMessage(error.message);
            showError('Error', error.message);
        }
    };

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setErrorMessage('');

        setUserData((prevData) => ({
            ...prevData,
            [name]: value
        }));

        // Perform validation
        SignupValidationSchema.validateAt(name, { ...userData, [name]: value })
            .then(() => {
                setUserDataError((prevError) => ({
                    ...prevError,
                    [name]: '' // Clear error for this field
                }));
            })
            .catch((err) => {
                setUserDataError((prevError) => ({
                    ...prevError,
                    [name]: err.message // Set error message for this field
                }));
            });
    };

    return (
        <div className={containerClassName}>
            <Toast ref={toast} />
            <div className="flex flex-column align-items-center justify-content-center">
                <div
                    style={{
                        marginTop: '15px',
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                            <div className="text-900 text-3xl font-medium mb-3">Reset Your Password</div>
                            <span className="text-600 font-medium">Please enter your new password below.</span>
                        </div>

                        <div>
                            <div className="mb-4" style={{ display: 'flex', flexDirection: 'column', maxWidth: '30rem' }}>
                                <label htmlFor="password" className="block text-900 font-medium text-xl mb-2">
                                    New Password
                                </label>
                                <Password
                                    inputId="password"
                                    name="password"
                                    value={userData.password}
                                    onChange={onChangeHandler}
                                    placeholder="Enter your new password"
                                    feedback={false}
                                    toggleMask
                                    className="w-full mb-2"
                                    inputClassName="w-full p-3 md:w-30rem"
                                />
                                {userDataError.password && <Message severity="error" text={userDataError.password} />}
                            </div>
                            <div className="mb-4" style={{ display: 'flex', flexDirection: 'column', maxWidth: '30rem' }}>
                                <label htmlFor="confirmPassword" className="block text-900 font-medium text-xl mb-2">
                                    Confirm Password
                                </label>
                                <Password
                                    inputId="confirmPassword"
                                    name="confirmPassword"
                                    value={userData.confirmPassword}
                                    onChange={onChangeHandler}
                                    placeholder="Confirm your new password"
                                    feedback={false}
                                    toggleMask
                                    className="w-full mb-2"
                                    inputClassName="w-full p-3 md:w-30rem"
                                />
                                {userDataError.confirmPassword && <Message severity="error" text={userDataError.confirmPassword} />}
                            </div>
                            <Button label="Reset Password" disabled={!!errorMessage} className="w-full p-3 text-xl" loading={isLoading} onClick={handleSubmit}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
