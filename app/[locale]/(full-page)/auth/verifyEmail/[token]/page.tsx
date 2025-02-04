'use client';

import { API_ROUTES } from '@/app/api/apiRoutes';
import { CustomSession } from '@/app/interfaces/customSession';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';

const VerifyEmail = () => {
  const { token }: { token: string } = useParams(); // Extract token from the URL
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');
  const toast = useRef<Toast>(null);
  const router = useRouter();
  const { data, status } = useSession() as { data: CustomSession, status: string };

  const handleVerification = async () => {
    if (!token) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Token is missing!', life: 3000 });
      return;
    }

    setIsLoading(true);
    setVerificationStatus('');

    try {
      // Simulate API call to verify email
      //const response = await verifyAccount(token);
      const res = await fetch(API_ROUTES.USERS.VERIFY_ACCOUNT(token), {
        headers: {
          Authorization: `Bearer ${data.accessToken}`
        }
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error);
      }
      const response = await res.text();

      //   const result = await response.json();
      setVerificationStatus('success');
      toast.current?.show({ severity: 'success', summary: 'Success', detail: response || 'Email verified successfully!', life: 3000 });

      // Redirect after successful verification (optional)
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (error: any) {
      setVerificationStatus('error');
      toast.current?.show({ severity: 'error', summary: 'Error', detail: error.message || 'Verification failed!', life: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-nogutter surface-0 text-800">
      <Toast ref={toast} />
      <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center">
        <section>
          <span className="block text-4xl font-bold mb-2">Verify Your Email</span>
          <div className="text-2xl text-primary font-bold mb-5">Click the button below to verify your email</div>


          <Button
            label={isLoading ? 'Verifying...' : 'Verify Email'}
            type="button"
            className="mr-3 p-button-raised"
            onClick={handleVerification}
            disabled={verificationStatus === 'error'}
            loading={isLoading}
          />
          {verificationStatus === 'success' && <p className="text-green-500 mt-4">Verification Successful!</p>}
          {verificationStatus === 'error' && <p className="text-red-500 mt-4">Verification Failed. Please try again.</p>}
        </section>
      </div>
      <div className="col-12 md:col-6 overflow-hidden">
        <img
          src="/demo/images/blocks/hero/hero-1.png"
          alt="hero-1"
          className="md:ml-auto block md:h-full"
          style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)' }}
        />
      </div>
    </div>
  );
};

export default VerifyEmail;
