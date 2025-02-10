import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import NextAuthProvider from './providers/nextAuthProvider';
import ClientLocaleWrapper from '@/layout/ClientLocaleWrapper';
import { routing } from '@/i18n/routing';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

interface RootLayoutProps {
    children: React.ReactNode,
    params: Promise<{ locale: string }>

}


export default async function RootLayout({ children, params }: RootLayoutProps) {

    const { locale } = await params;  // Await the params object

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        //notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages({ locale });

    const link = (<link id="theme-css" href={`/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>)

    return (
        <NextIntlClientProvider messages={messages}>
            <ClientLocaleWrapper>
                <head>
                    {link}
                </head>
                <body>
                    <NextAuthProvider>
                        <PrimeReactProvider>
                            <LayoutProvider>
                                {children}
                            </LayoutProvider>
                        </PrimeReactProvider>
                    </NextAuthProvider>
                </body>
            </ClientLocaleWrapper>
        </NextIntlClientProvider>
    );
}
