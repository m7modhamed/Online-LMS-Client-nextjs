import { Metadata } from 'next';
import AppConfig from '../../../layout/AppConfig';
import React from 'react';
import MainNavbar from '../../../demo/components/MainNavbar';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

interface SimpleLayoutProps {
    children: React.ReactNode,
    params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
    title: 'Online Learning Platform',
    description: 'The ultimate collection of design-agnostic, flexible and accessible React UI Components.'
};

export default async function SimpleLayout({ children, params
}: SimpleLayoutProps) {

    const { locale } = await params;  // Await the params object

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages({ locale });

    return (
        <React.Fragment>
            <NextIntlClientProvider locale={locale} messages={messages}>
                <div className="surface-0 ">
                    <MainNavbar />
                </div>
                {children}
                <AppConfig simple />
            </NextIntlClientProvider>
        </React.Fragment>
    );
}
