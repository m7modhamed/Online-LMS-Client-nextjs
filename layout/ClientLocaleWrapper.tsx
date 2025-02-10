'use client';

import { useLocale } from 'next-intl';

export default function ClientLocaleWrapper({ children }: { children: React.ReactNode }) {
    const locale = useLocale(); // Always runs on the client

    return (
        <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning={true} >
            {children}
        </html>
    );
}
