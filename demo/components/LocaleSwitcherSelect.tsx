'use client';
import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/routing';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { SelectItemOptionsType } from 'primereact/selectitem';

type Props = {
    children: SelectItemOptionsType;
    defaultValue: string;
};

export default function LocaleSwitcherSelect({
    children,
    defaultValue,
}: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();
    const params = useParams();

    function onSelectChange(event: DropdownChangeEvent) {
        const nextLocale = event.target.value;
        startTransition(() => {
            router.replace(
                // @ts-expect-error -- TypeScript will validate that only known `params`
                // are used in combination with a given `pathname`. Since the two will
                // always match for the current route, we can skip runtime checks.
                { pathname, params },
                { locale: nextLocale }
            );
            document.documentElement.setAttribute('lang', nextLocale);

            router.refresh();
        });

    }

    return (
        <label
            className={clsx(
                'relative text-gray-400',
                isPending && 'transition-opacity [&:disabled]:opacity-30'
            )}
        >
            <Dropdown
                className="inline-flex appearance-none bg-transparent py-1 pl-0 pr-0"
                disabled={isPending}
                onChange={(e) => { onSelectChange(e) }}
                options={children}
                value={defaultValue}
            />

        </label>
    );
}