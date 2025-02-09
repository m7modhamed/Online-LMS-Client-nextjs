'use client';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { Dialog } from 'primereact/dialog';
import { SignupValidationSchema } from '@/app/[locale]/(full-page)/auth/signup/ValidationSchema';



export default function ForgotPasswordRequest({ open, setOpen }: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>>; }) {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);

    const toast = React.useRef<Toast>(null);

    const handleSubmit = async () => {
        try {

            SignupValidationSchema.validateAt('email', { email: email })
                .then(() => {
                    setEmailError('');
                })
                .catch((err) => {
                    setEmailError(err.message);
                    return;
                });

            if (emailError || !email) {
                return;
            }
            setLoading(true);
            const res = await fetch(API_ROUTES.USERS.FORGOT_PASSWORD_REQUEST(email));

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error);
            }
            const response = await res.text();

            showSuccess('Success', response);
            setLoading(false);
            console.log(response);
            setTimeout(() => {
                setOpen(false);
            }, 2000);
        } catch (error: any) {
            setLoading(false);
            console.log(error);
            setEmailError(error.message);
            showError('Error', error.message);
        }

    };

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

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        console.log(name, value);
        setEmail(value);

        SignupValidationSchema.validateAt('email', { email: value })
            .then(() => {
                setEmailError('');
            })
            .catch((err) => {
                setEmailError(err.message);
            });
    };

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Reset Your Password</span>
        </div>
    );

    const footerContent = (
        <div>
            <Button loading={loading} label={loading ? 'Sending...' : 'Send Reset Email'} icon="pi pi-check" onClick={handleSubmit} autoFocus disabled={!!emailError} />
        </div>
    );

    return (
        <div>
            <Toast ref={toast} />
            <Dialog visible={open} modal header={headerElement} footer={footerContent} style={{ width: '50rem' }} onHide={() => setOpen(false)}>
                <p className="mb-4">Enter your email address below, and we will send you instructions to reset your password.</p>
                <div className="mb-4" style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                        Email Address
                    </label>
                    <InputText id="email" name="email" type="email" placeholder="Enter your email address" className="w-full mb-2" style={{ padding: '1rem' }} value={email} onChange={onChangeHandler} />
                    {emailError && <Message severity="error" text={emailError} />}
                </div>
            </Dialog>
        </div>
    );
}
