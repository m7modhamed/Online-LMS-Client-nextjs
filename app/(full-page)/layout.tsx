import { Metadata } from 'next';
import AppConfig from '../../layout/AppConfig';
import React from 'react';
import MainNavbar from '../(main)/(component)/MainNavbar';

interface SimpleLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'PrimeReact Sakai',
    description: 'The ultimate collection of design-agnostic, flexible and accessible React UI Components.'
};

export default function SimpleLayout({ children }: SimpleLayoutProps) {
    return (
        <React.Fragment>
            <div className="surface-0 ">
                <MainNavbar />
            </div>

            {children}
            <AppConfig simple />
        </React.Fragment>
    );
}
