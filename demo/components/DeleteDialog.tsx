import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React from 'react';
import { useTranslations } from 'next-intl';

export const DeleteDialog = ({ displayConfirmation, setDisplayConfirmation, deleteAction }: { displayConfirmation: boolean; setDisplayConfirmation: (value: boolean) => void; deleteAction: () => void }) => {
    const t = useTranslations('deleteDialog'); // Use the correct namespace

    const confirmationDialogFooter = (
        <>
            <Button type="button" label={t('noButton')} icon="pi pi-times" onClick={() => setDisplayConfirmation(false)} text />
            <Button type="button" label={t('yesButton')} icon="pi pi-check" onClick={() => deleteAction()} text autoFocus />
        </>
    );

    return (
        <div>
            <Dialog
                header={t('confirmationHeader')}
                visible={displayConfirmation}
                onHide={() => setDisplayConfirmation(false)}
                style={{ width: '350px' }}
                modal
                footer={confirmationDialogFooter}
            >
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>{t('confirmationMessage')}</span>
                </div>
            </Dialog>
        </div>
    );
};
