import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React from 'react';

export const DeleteDialog = ({ displayConfirmation, setDisplayConfirmation, deleteAction }: { displayConfirmation: boolean; setDisplayConfirmation: (value: boolean) => void; deleteAction: () => void }) => {
    const confirmationDialogFooter = (
        <>
            <Button type="button" label="No" icon="pi pi-times" onClick={() => setDisplayConfirmation(false)} text />
            <Button type="button" label="Yes" icon="pi pi-check" onClick={() => deleteAction()} text autoFocus />
        </>
    );

    return (
        <Dialog header="Confirmation" visible={displayConfirmation} onHide={() => setDisplayConfirmation(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooter}>
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                <span>Are you sure you want to delete the resource?</span>
            </div>
        </Dialog>
    );
};
