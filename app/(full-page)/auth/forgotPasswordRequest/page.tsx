'use client';
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { SignupValidationSchema } from '../register/ValidationSchema';
import { Message } from 'primereact/message';
import { forgotPasswordRequest } from '@/demo/service/UserServices';

export default function ForgotPasswordRequest({ openResetPasswordDialog, setOpenResetPasswordDialog }: { openResetPasswordDialog: boolean; setOpenResetPasswordDialog: (val: boolean) => void }) {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);

    const toast = React.useRef<Toast>(null);

    const handleSubmit = async () => {
        try {
            if (emailError) {
                return;
            }

            SignupValidationSchema.validateAt('email', { email: email })
                .then(() => {
                    setEmailError('');
                })
                .catch((err) => {
                    setEmailError(err.message);
                });

            setLoading(true);
            const response = await forgotPasswordRequest(email);

            showSuccess('Success', response);
            setLoading(false);
            console.log(response);
            setTimeout(() => {
                setOpenResetPasswordDialog(false);
            }, 3000);
        } catch (error: any) {
            setLoading(false);
            console.log(error);
            setEmailError(error.message);
            showError('Error', error.message);
        }
        // setOpen(false);
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
            <Dialog visible={openResetPasswordDialog} modal header={headerElement} footer={footerContent} style={{ width: '50rem' }} onHide={() => setOpenResetPasswordDialog(false)}>
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
