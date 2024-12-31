/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { loginValidationSchema } from '../register/ValidationSchema';
import { login } from '@/demo/service/UserServices';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { useAuth } from '@/app/Authentication/AuthContext';
import ForgotPasswordRequest from '../forgotPasswordRequest/page';

const LoginPage = () => {
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const initialState = {
        email: '',
        password: ''
    };

    interface IUserData {
        email: string;
        password: string;
    }

    interface IUserDataError {
        email?: '';
        password?: '';
    }
    const [userData, setUserData] = useState<IUserData>(initialState);
    const [errorMessage, setErrorMessage] = useState('');
    const [userDataError, setUserDataError] = useState<IUserDataError>();
    const [isLoading, setIsLoading] = useState(false);
    const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState(false);

    const { login: authLogin, user, logout, isAuthenticated } = useAuth();

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        //reset error message
        setErrorMessage('');

        const { name, value } = event.target;
        console.log(name, value);
        setUserData((prevUserData) => {
            const updatedUserData = { ...prevUserData, [name]: value.trim() };

            // Validate the field on change using Yup schema
            loginValidationSchema
                .validateAt(name, updatedUserData)
                .then(() => {
                    setUserDataError((prevUserDataError) => ({
                        ...prevUserDataError,
                        [name]: ''
                    }));
                })
                .catch((err) => {
                    setUserDataError((prevUserDataError) => ({
                        ...prevUserDataError,
                        [name]: err.message
                    }));
                });
            return updatedUserData;
        });
    };
    console.log(userData);

    const resetform = () => {
        setUserData(initialState);
        setErrorMessage('');
    };

    const handleSubmit = async () => {
        try {
            if (errorMessage) {
                return;
            }
            // Validate the field on change using Yup schema
            await loginValidationSchema.validate(userData, { abortEarly: false });

            setErrorMessage('');
            setIsLoading(true);

            // Call API if validation passes
            const response = await login(userData);

            const token = response.token;
            console.log(token);

            // Call login method from AuthContext to save token and set user
            authLogin(token, (user) => {
                const userRole = user.role; // Ensure `user` is updated
                console.log(userRole);
                switch (userRole) {
                    case 'ROLE_ADMIN':
                        router.push('/admin-dashboard');
                        break;
                    case 'ROLE_INSTRUCTOR':
                        router.push('/instructorDashboard');
                        break;
                    case 'ROLE_USER':
                        router.push('/user-dashboard');
                        break;
                    default:
                        router.push('/');
                }
            });
            
            setIsLoading(false);
            resetform();
        } catch (error: any) {
            if (error.name === 'ValidationError') {
                const errors: IUserDataError = {};
                error.inner.forEach((err: any) => {
                    if (err.path) {
                        errors[err.path as keyof IUserDataError] = err.message;
                    }
                });
                setUserDataError(errors);
            } else {
                setErrorMessage(error.message);
                showError('Error', error.message);
            }
            setIsLoading(false);
        }
    };

    const toast = useRef<Toast>(null);

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
            {openResetPasswordDialog && <ForgotPasswordRequest openResetPasswordDialog={openResetPasswordDialog} setOpenResetPasswordDialog={setOpenResetPasswordDialog} />}
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
                            <div className="text-900 text-3xl font-medium mb-3">Welcome, Isabel!</div>
                            <span className="text-600 font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <div className="mb-4" style={{ display: 'flex', flexDirection: 'column', maxWidth: '30rem' }}>
                                <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                                    Email
                                </label>
                                <InputText id="email" name="email" type="text" value={userData.email} onChange={(e) => onChangeHandler(e)} placeholder="Email address" className="w-full md:w-30rem mb-2" style={{ padding: '1rem' }} />
                                {userDataError?.email && <Message severity="error" text={userDataError.email} />}
                            </div>
                            <div className="mb-4" style={{ display: 'flex', flexDirection: 'column', maxWidth: '30rem' }}>
                                <label htmlFor="password" className="block text-900 font-medium text-xl mb-2">
                                    Password
                                </label>
                                <Password
                                    inputId="password"
                                    name="password"
                                    value={userData.password}
                                    onChange={(e) => onChangeHandler(e)}
                                    placeholder="Password"
                                    feedback={false}
                                    toggleMask
                                    className="w-full mb-2"
                                    inputClassName="w-full p-3 md:w-30rem"
                                ></Password>
                                {userDataError?.password && <Message severity="error" text={userDataError.password} />}
                            </div>
                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme1">Remember me</label>
                                </div>
                                <a
                                    onClick={() => {
                                        setOpenResetPasswordDialog(true);
                                    }}
                                    className="font-medium no-underline ml-2 text-right cursor-pointer"
                                    style={{ color: 'var(--primary-color)' }}
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <Button label="Sign In" disabled={!!errorMessage} className="w-full p-3 text-xl" loading={isLoading} onClick={() => handleSubmit()}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
