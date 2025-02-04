import Layout from '@/layout/layout';
import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'Online Learning Platform',
    description: 'The ultimate collection of design-agnostic, flexible and accessible React UI Components.',
    robots: { index: false, follow: false },
    openGraph: {
        type: 'website',
        title: 'Online Learning ',
        url: 'https://sakai.primereact.org/',
        description: 'The ultimate collection of design-agnostic, flexible and accessible React UI Components.',
        images: ['https://www.primefaces.org/static/social/sakai-react.png'],
        ttl: 604800
    },
    icons: {
        icon: '/favicon.ico'
    }
};
export const viewport = {
    initialScale: 1,
    width: 'device-width',
};
interface AppLayoutProps {
    children: React.ReactNode,
    params: Promise<{ locale: string }>

}
export default async function AppLayout({ children, params
}: AppLayoutProps) {

    const { locale } = await params;  // Await the params object

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return <Layout>
        <NextIntlClientProvider messages={messages}>
            {children}
        </NextIntlClientProvider>
    </Layout>;
}
