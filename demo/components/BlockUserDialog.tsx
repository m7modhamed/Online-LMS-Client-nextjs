import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";
import { API_ROUTES } from "@/app/api/apiRoutes";
import { useSession } from "next-auth/react";
import { IUserData } from "@/app/interfaces/interfaces";
import { useTranslations } from "next-intl";  // Import the hook for translations

export default function BlockUserDialog({
    show,
    setShow,
    userId,
    imageUrl,
    fullName,
    isBlocked: initialIsBlocked,
    setUsers
}: {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    userId: string;
    imageUrl: string;
    fullName: string;
    isBlocked: boolean;
    setUsers: React.Dispatch<React.SetStateAction<IUserData[]>>
}) {
    const [isBlocked, setIsBlocked] = useState(initialIsBlocked);
    const { data } = useSession();
    const t = useTranslations("blockUserDialog");

    // Toggle block/unblock state
    const toggleBlockStatus = () => {
        toggleRequest();

        setIsBlocked((prev) => !prev);
    };

    const toggleRequest = async () => {
        if (!data) {
            return;
        }

        const res = await fetch(API_ROUTES.USERS.TOGGLE_BLOCK(userId), {
            headers: {
                Authorization: `Bearer ${data?.accessToken}`
            }
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Error fetching categories');
        }
        const response = await res.text();
        console.log('res', response);

        setUsers((prevState) => {
            if (!prevState) return prevState;

            return prevState.map((user) =>
                user.id === Number(userId)
                    ? { ...user, isBlocked: !user.isBlocked }
                    : user
            );
        });

        setShow(false);
    }

    const headerElement = (
        <div className="inline-flex align-items-center gap-2">
            <Avatar image={imageUrl} shape="circle" />
            <span className="font-bold">{fullName}</span>
        </div>
    );

    const footerContent = (
        <div className="flex justify-end gap-2">
            <Button label={t('close')} icon="pi pi-times" onClick={() => setShow(false)} />
            <Button
                label={isBlocked ? t('unblockUser') : t('blockUser')}
                icon={isBlocked ? "pi pi-lock-open" : "pi pi-lock"}
                severity={isBlocked ? "success" : "danger"}
                onClick={toggleBlockStatus}
            />
        </div>
    );

    return (
        <Dialog visible={show} modal header={headerElement} footer={footerContent} style={{ width: "40rem" }} onHide={() => setShow(false)}>
            <div className="flex align-items-center gap-2 mb-3">
                <span>{t('userBlocked')}</span>
                <Tag severity={isBlocked ? "danger" : "success"}>{isBlocked ? t('currentlyBlocked') : t('currentlyUnblocked')}</Tag>
            </div>

            <p className="m-0">
                {t('toggleBlockStatus', { action: isBlocked ? t('unblock') : t('blockUser') })}
            </p>
        </Dialog>
    );
}
