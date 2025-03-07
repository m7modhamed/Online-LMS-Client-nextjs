'use client';
import React, { useContext, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Link } from '@/i18n/routing';
import styles from './styles.module.css';
import { SignupValidationSchema } from './ValidationSchema';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { ISignup, ISignupError } from '@/app/interfaces/interfaces';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { useTranslations } from 'next-intl';

const SignUpPage = () => {
    const initialState: ISignup = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        confirmPassword: ''
    };
    const initialErrorState: ISignupError = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        confirmPassword: ''
    };

    const [formData, setFormData] = useState<ISignup>(initialState);
    const [formDataError, setFormDataError] = useState<ISignupError>(initialErrorState);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const toast = useRef<Toast>(null);
    const t = useTranslations("signup");



    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', {
        'p-input-filled': layoutConfig.inputStyle === 'filled'
    });

    const resetform = () => {
        setFormData(initialState);
        setErrorMessage('');
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        //reset error message
        setErrorMessage('');

        const { name, value } = event.target;

        setFormData((prevUserData) => {
            const updatedUserData = { ...prevUserData, [name]: value };

            // Validate the field on change using Yup schema
            SignupValidationSchema.validateAt(name, updatedUserData)
                .then(() => {
                    setFormDataError((prevUserDataError) => ({
                        ...prevUserDataError,
                        [name]: ''
                    }));
                })
                .catch((err) => {
                    setFormDataError((prevUserDataError) => ({
                        ...prevUserDataError,
                        [name]: err.message
                    }));
                });

            return updatedUserData;
        });
    };

    const handleSignUp = async () => {
        if (errorMessage) {
            return;
        }
        setErrorMessage('');
        setIsLoading(true);
        try {
            // Validate using Yup schema
            await SignupValidationSchema.validate(formData, { abortEarly: false });

            // Call API if validation passes
            const res = await fetch(API_ROUTES.USERS.SIGN_UP_STUDENT, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(formData)
            });
            if (!res.ok) {
                const error = await res.json();
                console.log(error)
                throw new Error(error.message);
            }
            const response = await res.text();


            setIsLoading(false);
            showSuccess('registeration success', response);
            resetform();
        } catch (error: any) {
            setIsLoading(false);
            console.log(Object.values(error));

            // If it's a Yup validation error
            if (error.name === 'ValidationError') {
                const errors: ISignupError = {};
                error.inner.forEach((err: any) => {
                    if (err.path) {
                        errors[err.path as keyof ISignupError] = err.message;
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
                <div
                    style={{
                        marginTop: '15px',
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-6 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-2 w-6rem flex-shrink-0" />
                            <div className="text-900 text-3xl font-medium mb-3">{t("createAccount")}</div>
                            <span className="text-600 font-medium">{t("signUpMessage")}</span>
                        </div>

                        <div></div>
                        {/* Form Container */}
                        <div className={styles.formContainer}>
                            {/* First Name */}
                            <div className="mb-1" style={{ display: 'flex', flexDirection: 'column', maxWidth: '30rem' }}>
                                <label htmlFor="firstName" className="block text-900 text-xl font-medium mb-2">
                                    {t("firstName")}
                                </label>
                                <InputText
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder={t("firstName")}
                                    className={`w-full md:w-30rem mb-2 p-inputtext-sm ${formDataError.firstName ? 'p-invalid' : ''}`}
                                    style={{ padding: '1rem' }}
                                />
                                {formDataError.firstName && <Message severity="error" text={formDataError.firstName} />}
                            </div>

                            {/* Last Name */}
                            <div className="mb-1" style={{ display: 'flex', flexDirection: 'column', maxWidth: '30rem' }}>
                                <label htmlFor="lastName" className="block text-900 text-xl font-medium mb-2">
                                    {t("lastName")}
                                </label>
                                <InputText
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    placeholder={t("lastName")}
                                    className={`w-full md:w-30rem mb-2 p-inputtext-sm ${formDataError.lastName ? 'p-invalid' : ''}`}
                                    style={{ padding: '1rem' }}
                                />
                                {formDataError.lastName && <Message severity="error" text={formDataError.lastName} />}
                            </div>

                            {/* Email */}
                            <div className="mb-1" style={{ display: 'flex', flexDirection: 'column', maxWidth: '30rem' }}>
                                <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                                    {t("email")}
                                </label>
                                <InputText
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder={t("email")}
                                    className={`w-full md:w-30rem mb-2 p-inputtext-sm ${formDataError.email ? 'p-invalid' : ''}`}
                                    style={{ padding: '1rem' }}
                                />
                                {formDataError.email && <Message severity="error" text={formDataError.email} />}
                            </div>

                            {/* Phone Number */}
                            <div className="mb-1" style={{ display: 'flex', flexDirection: 'column', maxWidth: '30rem' }}>
                                <label htmlFor="phoneNumber" className="block text-900 text-xl font-medium mb-2">
                                    {t("phoneNumber")}
                                </label>
                                <InputText
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    placeholder={t("phoneNumber")}
                                    className={`w-full md:w-30rem mb-2 p-inputtext-sm ${formDataError.phoneNumber ? 'p-invalid' : ''}`}
                                    style={{ padding: '1rem' }}
                                />
                                {formDataError.phoneNumber && <Message severity="error" text={formDataError.phoneNumber} />}
                            </div>

                            {/* Password */}
                            <div className="mb-1" style={{ display: 'flex', flexDirection: 'column', maxWidth: '30rem' }}>
                                <label htmlFor="password" className="block text-900 font-medium text-xl mb-2">
                                    {t("password")}
                                </label>
                                <Password
                                    inputId="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder={t("password")}
                                    toggleMask
                                    className={`w-full mb-2 p-password-sm ${formDataError.password ? 'p-invalid' : ''}`}
                                    inputClassName="w-full p-3 md:w-30rem"
                                />
                                {formDataError.password && <Message severity="error" text={formDataError.password} />}
                            </div>

                            {/* Confirm Password */}
                            <div className="mb-1" style={{ display: 'flex', flexDirection: 'column', maxWidth: '30rem' }}>
                                <label htmlFor="confirmPassword" className="block text-900 font-medium text-xl mb-2">
                                    {t("confirmPassword")}
                                </label>
                                <Password
                                    inputId="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder={t("confirmPassword")}
                                    toggleMask
                                    className={`w-full mb-2 p-password-sm ${formDataError.confirmPassword ? 'p-invalid' : ''}`}
                                    inputClassName="w-full p-3 md:w-30rem"
                                />
                                {formDataError.confirmPassword && <Message severity="error" text={formDataError.confirmPassword} />}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex align-items-center justify-content-around mb-5 gap-5">
                            <Link href={'/auth/login'}>
                                <p className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    {t("alreadyHaveAccount")}
                                </p>
                            </Link>
                            <Button label={t("signup")} className="w-full md:w-30rem p-button-sm p-button-rounded p-button-primary" onClick={handleSignUp} disabled={!!errorMessage} loading={isLoading} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
