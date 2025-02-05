'use client';
import React, { useContext, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import styles from './styles.module.css';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { BusinessSignupValidationSchema } from '../signup/ValidationSchema';
import { useTranslations } from 'next-intl';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/interfaces/customSession';
import { Link } from '@/i18n/routing';

const SignUpPage: React.FC = () => {
    interface IFormData {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        confirmPassword: string;
        phoneNumber: string;
        specialization: string;
        aboutMe: string;
        linkedinUrl: string;
        githubUrl: string;
        facebookUrl: string;
        twitterUrl: string;
    }
    interface IFormDataError {
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
        phoneNumber?: string;
        specialization?: string;
        aboutMe?: string;
        linkedinUrl?: string;
        githubUrl?: string;
        facebookUrl?: string;
        twitterUrl?: string;
        confirmPassword?: string;
    }
    const initialState: IFormData = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        specialization: '',
        aboutMe: '',
        linkedinUrl: '',
        githubUrl: '',
        facebookUrl: '',
        twitterUrl: ''
    };
    const toast = useRef<Toast>(null);

    const [formData, setFormData] = useState<IFormData>(initialState);
    const [formDataError, setFormDataError] = useState<IFormDataError>(initialState);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const t = useTranslations();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', {
        'p-input-filled': layoutConfig.inputStyle === 'filled'
    });

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        //reset error message
        setErrorMessage('');

        const { name, value } = event.target;

        setFormData((prevUserData) => {
            const updatedUserData = { ...prevUserData, [name]: value };

            // Validate the field on change using Yup schema
            BusinessSignupValidationSchema.validateAt(name, updatedUserData)
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

            return updatedUserData;
        });
    };

    const handleSubmit = async () => {
        if (errorMessage) {
            return;
        }
        setErrorMessage('');
        setIsLoading(true);

        try {
            // Validate using Yup schema
            await BusinessSignupValidationSchema.validate(formData, {
                abortEarly: false
            });

            // Call API if validation passes
            //const response = await signupInstructorAccount(formData);
            const res = await fetch(API_ROUTES.USERS.SIGN_UP_INSTRUCTOR, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message);
            }
            const response = await res.text();

            setIsLoading(false);
            showSuccess('Registration successful', response);

            resetForm();
        } catch (error: any) {
            setIsLoading(false);

            // If it's a Yup validation error
            if (error.name === 'ValidationError') {
                const errors: IFormDataError = {};
                error.inner.forEach((err: any) => {
                    if (err.path) {
                        errors[err.path as keyof IFormDataError] = err.message;
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
        }
    };

    const resetForm = () => {
        setFormData(initialState);
        setErrorMessage('');
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
        <div className={containerClassName}>
            <Toast ref={toast} />

            <div className="flex flex-column align-items-center justify-content-center">
                <div style={{ marginTop: '15px', borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-6 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-2 w-6rem flex-shrink-0" />
                            <div className="text-900 text-3xl font-medium mb-3">{t('businessSignup.title')}</div>
                            <span className="text-600 font-medium">{t('businessSignup.signUp')}</span>
                        </div>

                        <div className={styles.formContainer}>
                            {/* First Name */}
                            <div className="mb-1" style={{ display: 'flex', flexDirection: 'column', maxWidth: '30rem' }}>
                                <label htmlFor="firstName" className="block text-900 text-xl font-medium mb-2">
                                    {t('businessSignup.firstName')}
                                </label>
                                <InputText
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={onChangeHandler}
                                    placeholder={t('businessSignup.firstName')}
                                    className={`w-full md:w-30rem mb-2 p-inputtext-sm ${formDataError.firstName ? 'p-invalid' : ''}`}
                                />
                                {formDataError.firstName && <Message severity="error" text={formDataError.firstName} />}
                            </div>

                            {/* Last Name */}
                            <div className="mb-1" style={{ display: 'flex', flexDirection: 'column', maxWidth: '30rem' }}>
                                <label htmlFor="lastName" className="block text-900 text-xl font-medium mb-2">
                                    {t('businessSignup.lastName')}
                                </label>
                                <InputText id="lastName" name="lastName" value={formData.lastName} onChange={onChangeHandler} placeholder={t('businessSignup.lastName')} className={`w-full md:w-30rem mb-2 p-inputtext-sm ${formDataError.lastName ? 'p-invalid' : ''}`} />
                                {formDataError.lastName && <Message severity="error" text={formDataError.lastName} />}
                            </div>

                            {/* Email */}
                            <div className="mb-1" style={{ display: 'flex', flexDirection: 'column', maxWidth: '30rem' }}>
                                <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                                    {t('businessSignup.email')}
                                </label>
                                <InputText id="email" name="email" value={formData.email} onChange={onChangeHandler} placeholder={t('businessSignup.email')} className={`w-full md:w-30rem mb-2 p-inputtext-sm ${formDataError.email ? 'p-invalid' : ''}`} />
                                {formDataError.email && <Message severity="error" text={formDataError.email} />}
                            </div>

                            {/* Phone Number */}
                            <div className="mb-1" style={{ display: 'flex', flexDirection: 'column', maxWidth: '30rem' }}>
                                <label htmlFor="phoneNumber" className="block text-900 text-xl font-medium mb-2">
                                    {t('businessSignup.phoneNumber')}
                                </label>
                                <InputText
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={onChangeHandler}
                                    placeholder={t('businessSignup.phoneNumber')}
                                    className={`w-full md:w-30rem mb-2 p-inputtext-sm ${formDataError.phoneNumber ? 'p-invalid' : ''}`}
                                />
                                {formDataError.phoneNumber && <Message severity="error" text={formDataError.phoneNumber} />}
                            </div>

                            {/* Specialization */}
                            <div className="mb-1" style={{ display: 'flex', flexDirection: 'column', maxWidth: '30rem' }}>
                                <label htmlFor="specialization" className="block text-900 text-xl font-medium mb-2">
                                    {t('businessSignup.specialization')}
                                </label>
                                <InputText
                                    id="specialization"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={onChangeHandler}
                                    placeholder={t('businessSignup.specialization')}
                                    className={`w-full md:w-30rem mb-2 p-inputtext-sm ${formDataError.specialization ? 'p-invalid' : ''}`}
                                />
                                {formDataError.specialization && <Message severity="error" text={formDataError.specialization} />}
                            </div>

                            {/* About Me */}
                            <div className="mb-1" style={{ display: 'flex', flexDirection: 'column', maxWidth: '30rem' }}>
                                <label htmlFor="aboutMe" className="block text-900 text-xl font-medium mb-2">
                                    {t('businessSignup.aboutMe')}
                                </label>
                                <InputText id="aboutMe" name="aboutMe" value={formData.aboutMe} onChange={onChangeHandler} placeholder={t('businessSignup.aboutMe')} className={`w-full md:w-30rem mb-2 p-inputtext-sm ${formDataError.aboutMe ? 'p-invalid' : ''}`} />
                                {formDataError.aboutMe && <Message severity="error" text={formDataError.aboutMe} />}
                            </div>

                            {/* LinkedIn URL */}
                            <div className="mb-1" style={{ display: 'flex', flexDirection: 'column', maxWidth: '30rem' }}>
                                <label htmlFor="linkedinUrl" className="block text-900 text-xl font-medium mb-2">
                                    {t('businessSignup.linkedinUrl')}
                                </label>
                                <InputText
                                    id="linkedinUrl"
                                    name="linkedinUrl"
                                    value={formData.linkedinUrl}
                                    onChange={onChangeHandler}
                                    placeholder={t('businessSignup.linkedinUrl')}
                                    className={`w-full md:w-30rem mb-2 p-inputtext-sm ${formDataError.linkedinUrl ? 'p-invalid' : ''}`}
                                />
                                {formDataError.linkedinUrl && <Message severity="error" text={formDataError.linkedinUrl} />}
                            </div>

                            {/* Github URL */}
                            <div className="mb-1" style={{ display: 'flex', flexDirection: 'column', maxWidth: '30rem' }}>
                                <label htmlFor="githubUrl" className="block text-900 text-xl font-medium mb-2">
                                    {t('businessSignup.githubUrl')}
                                </label>
                                <InputText
                                    id="githubUrl"
                                    name="githubUrl"
                                    value={formData.githubUrl}
                                    onChange={onChangeHandler}
                                    placeholder={t('businessSignup.githubUrl')}
                                    className={`w-full md:w-30rem mb-2 p-inputtext-sm ${formDataError.githubUrl ? 'p-invalid' : ''}`}
                                />
                                {formDataError.githubUrl && <Message severity="error" text={formDataError.githubUrl} />}
                            </div>

                            {/* Facebook URL */}
                            <div className="mb-1" style={{ display: 'flex', flexDirection: 'column', maxWidth: '30rem' }}>
                                <label htmlFor="facebookUrl" className="block text-900 text-xl font-medium mb-2">
                                    {t('businessSignup.facebookUrl')}
                                </label>
                                <InputText
                                    id="facebookUrl"
                                    name="facebookUrl"
                                    value={formData.facebookUrl}
                                    onChange={onChangeHandler}
                                    placeholder={t('businessSignup.facebookUrl')}
                                    className={`w-full md:w-30rem mb-2 p-inputtext-sm ${formDataError.facebookUrl ? 'p-invalid' : ''}`}
                                />
                                {formDataError.facebookUrl && <Message severity="error" text={formDataError.facebookUrl} />}
                            </div>

                            {/* Twitter URL */}
                            <div className="mb-1" style={{ display: 'flex', flexDirection: 'column', maxWidth: '30rem' }}>
                                <label htmlFor="twitterUrl" className="block text-900 text-xl font-medium mb-2">
                                    {t('businessSignup.twitterUrl')}
                                </label>
                                <InputText
                                    id="twitterUrl"
                                    name="twitterUrl"
                                    value={formData.twitterUrl}
                                    onChange={onChangeHandler}
                                    placeholder={t('businessSignup.twitterUrl')}
                                    className={`w-full md:w-30rem mb-2 p-inputtext-sm ${formDataError.twitterUrl ? 'p-invalid' : ''}`}
                                />
                                {formDataError.twitterUrl && <Message severity="error" text={formDataError.twitterUrl} />}
                            </div>

                            {/* Password */}
                            <div className="mb-1" style={{ display: 'flex', flexDirection: 'column', maxWidth: '30rem' }}>
                                <label htmlFor="password" className="block text-900 font-medium text-xl mb-2">
                                    {t('businessSignup.password')}
                                </label>
                                <Password
                                    inputId="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={onChangeHandler}
                                    placeholder={t('businessSignup.password')}
                                    toggleMask
                                    className={`w-full md:w-30rem mb-2 p-inputtext-sm ${formDataError.password ? 'p-invalid' : ''}`}
                                    inputClassName="w-full p-3 md:w-30rem"
                                />
                                {formDataError.password && <Message severity="error" text={formDataError.password} />}
                            </div>

                            {/* Confirm Password */}
                            <div className="mb-1" style={{ display: 'flex', flexDirection: 'column', maxWidth: '30rem' }}>
                                <label htmlFor="confirmPassword" className="block text-900 font-medium text-xl mb-2">
                                    {t('businessSignup.confirmPassword')}
                                </label>
                                <Password
                                    inputId="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={onChangeHandler}
                                    placeholder={t('businessSignup.confirmPassword')}

                                    toggleMask
                                    className={`w-full md:w-30rem mb-2 p-inputtext-sm ${formDataError.confirmPassword ? 'p-invalid' : ''}`}
                                    inputClassName="w-full p-3 md:w-30rem"
                                />
                                {formDataError.confirmPassword && <Message severity="error" text={formDataError.confirmPassword} />}
                            </div>

                            {/* Submit Button */}
                            <Button label={isLoading ? 'Loading...' : t('businessSignup.createAccount')} icon="pi pi-user-plus" onClick={handleSubmit} className="w-full p-button-lg p-button-rounded" disabled={isLoading} />

                            {/* Link to Login Page */}
                            <div className="mt-4 text-center">
                                <Link href="/auth/login" className="text-blue-500">
                                    {t('businessSignup.alreadyHaveAccount')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
