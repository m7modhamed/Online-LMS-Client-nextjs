/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext,  useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { loginValidationSchema } from '../signup/ValidationSchema';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { signIn } from 'next-auth/react';
import { ILogin, ILoginError } from '@/app/interfaces/interfaces';
import Link from 'next/link';
import ForgotPasswordRequest from '../forgotPasswordRequest/page';
import { useTranslations } from 'next-intl';

const LoginPage = () => {
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const initialState = {
        email: '',
        password: ''
    };
    const searchParams = useSearchParams();
    const message = searchParams.get('error');
    //console.log('error' , message)
    const [userData, setUserData] = useState<ILogin>(initialState);
    const [errorMessage, setErrorMessage] = useState('');
    const [userDataError, setUserDataError] = useState<ILoginError>();
    const [isLoading, setIsLoading] = useState(false);
    const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState<boolean>(false);
    const t = useTranslations("login");

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        //reset error message
        setErrorMessage('');

        const { name, value } = event.target;

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

            const result = await signIn('credentials', {
                redirect: false,
                email: userData.email,
                password: userData.password
            });
            console.log('SignIn Result:', result);

            if (result?.error) {
                setErrorMessage(result.error);
                showError('Error', result.error);
                setIsLoading(false);
            }

            if (result?.ok) {
                router.push('/');
            }

            setIsLoading(false);
            resetform();
        } catch (error: any) {
            if (error.name === 'ValidationError') {
                const errors: ILoginError = {};
                error.inner.forEach((err: any) => {
                    if (err.path) {
                        errors[err.path as keyof ILoginError] = err.message;
                    }
                });
                setUserDataError(errors);
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
                            <div className="text-900 text-3xl font-medium mb-3">{t("welcomeMessage")}</div>
                            <span className="text-600 font-medium">{t("signInToContinue")}</span>
                        </div>

                        {message === 'invalid-token' &&
                            <div className='w-full text-center m-auto'>
                                <Message
                                    severity="error"
                                    text={message === 'invalid-token'
                                        ? t("sessionExpired")
                                        : 'An error occurred.'}
                                />

                            </div>
                        }
                        <div>
                            <div className="mb-4" style={{ display: 'flex', flexDirection: 'column', maxWidth: '30rem' }}>
                                <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                                    {t("email")}
                                </label>
                                <InputText id="email" name="email" type="text" value={userData.email} onChange={(e) => onChangeHandler(e)} placeholder={t("emailPlaceholder")} className="w-full md:w-30rem mb-2" style={{ padding: '1rem' }} />
                                {userDataError?.email && <Message severity="error" text={userDataError.email} />}
                            </div>
                            <div className="mb-4" style={{ display: 'flex', flexDirection: 'column', maxWidth: '30rem' }}>
                                <label htmlFor="password" className="block text-900 font-medium text-xl mb-2">
                                    {t("password")}
                                </label>
                                <Password
                                    inputId="password"
                                    name="password"
                                    value={userData.password}
                                    onChange={(e) => onChangeHandler(e)}
                                    placeholder={t("passwordPlaceholder")}
                                    feedback={false}
                                    toggleMask
                                    className="w-full mb-2"
                                    inputClassName="w-full p-3 md:w-30rem"
                                ></Password>
                                {userDataError?.password && <Message severity="error" text={userDataError.password} />}
                            </div>
                            <div className="flex align-items-center justify-content-between mb-5 gap-5">

                                <Link href={'/auth/signup'}>
                                    <div className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                        {t("signUpNow")}
                                    </div>
                                </Link>

                                <a
                                    onClick={() => {
                                        setOpenResetPasswordDialog(true);
                                    }}
                                    className="font-medium no-underline ml-2 text-right cursor-pointer"
                                    style={{ color: 'var(--primary-color)' }}
                                >
                                    {t("forgotPassword")}
                                </a>
                            </div>
                            <Button label={t("signIn")} disabled={!!errorMessage} className="w-full p-3 text-xl" loading={isLoading} onClick={() => handleSubmit()}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
