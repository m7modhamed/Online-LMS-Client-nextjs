import { useLocale, useTranslations } from 'next-intl';
import { routing } from '@/i18n/routing';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';

export default function LocaleSwitcher() {
    const t = useTranslations('LocaleSwitcher');
    const locale = useLocale();

    const localeOptions = routing.locales.map((cur) => ({
        label: t('locale', { locale: cur }),
        value: cur
    }));

    return (
        <LocaleSwitcherSelect defaultValue={locale}>
            {localeOptions}
        </LocaleSwitcherSelect>
    );
}