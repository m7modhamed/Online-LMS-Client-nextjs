'use client';

import React, { useState, useEffect } from 'react';
import { DataTable, DataTableFilterMeta, DataTableRowClickEvent, DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { useSession } from 'next-auth/react';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { IUserData, userPaginationResponse } from '@/app/interfaces/interfaces';
import { getImageUrl } from '@/app/lib/utilities';
import { Avatar } from 'primereact/avatar';
import BlockUserDialog from './BlockUserDialog';
import { useTranslations } from 'next-intl';  // Importing useTranslations

export default function UserTableList() {
    const [users, setUsers] = useState<IUserData[]>([]);
    const [showBlockUserDialog, setShowBlockUserDialog] = useState(false);
    const [pageData, setPageData] = useState<userPaginationResponse>();
    const [pageRequest, setPageRequest] = useState({
        offset: 0,
        pageSize: 3,
        sortBy: '',
        sortDirection: ''
    });
    const [loading, setLoading] = useState<boolean>(true);
    const { data } = useSession();
    const [dialogData, setDialogData] = useState<{
        fullName: string,
        imageUrl: string,
        isBlocked: boolean,
        id: string
    }>({
        fullName: '',
        imageUrl: '',
        isBlocked: false,
        id: ''
    });

    const t = useTranslations("userTable"); // Initialize translations

    useEffect(() => {
        const fetchUsers = async () => {
            if (!data) {
                return;
            }

            try {
                setLoading(true);
                const res = await fetch(API_ROUTES.USERS.GET_USERS(data?.user.id, pageRequest.offset, pageRequest.pageSize, pageRequest.sortBy, pageRequest.sortBy), {
                    headers: {
                        Authorization: `Bearer ${data?.accessToken}`
                    }
                });
                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.message || 'Error fetching categories');
                }
                const response = await res.json();
                setPageData(response)
                setUsers(response.content);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [data, pageRequest]);

    const handlePageMovement = (e: DataTableStateEvent) => {
        const { page } = e;
        if (page === undefined) {
            return;
        }
        setPageRequest({ ...pageRequest, "offset": page })
    }

    const renderHeader = () => (
        <div className="flex justify-content-between">
            <InputText placeholder={t('searchPlaceholder')} />
        </div>
    );

    const roleBodyTemplate = (rowData: IUserData) => <Tag value={rowData.role.name} />;

    const statusBodyTemplate = (rowData: IUserData) => (
        <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.isActive, 'text-red-500 pi-times-circle': !rowData.isActive })}></i>
    );
    const blockBodyTemplate = (rowData: IUserData) => (
        <i className={classNames('pi', { 'text-green-500 pi-check-circle': !rowData.isBlocked, 'text-red-500 pi-times-circle': rowData.isBlocked })}></i>
    );

    const handleOnRowClick = (e: DataTableRowClickEvent) => {
        setDialogData(() => {
            return {
                "fullName": e.data?.firstName + ' ' + e.data?.lastName,
                "imageUrl": getImageUrl(e.data?.profileImage?.imageUrl),
                "isBlocked": e.data?.isBlocked,
                "id": e.data.id
            }
        })
        setShowBlockUserDialog(true);
    }

    return (
        <div className="card w-full">
            {showBlockUserDialog &&
                <BlockUserDialog
                    show={showBlockUserDialog}
                    setShow={setShowBlockUserDialog}
                    fullName={dialogData.fullName}
                    imageUrl={dialogData.imageUrl}
                    isBlocked={dialogData.isBlocked}
                    userId={dialogData.id}
                    setUsers={setUsers}
                />
            }
            <DataTable
                value={users}
                alwaysShowPaginator
                paginator
                lazy
                totalRecords={pageData?.totalElements}
                rows={pageData?.pageable.pageSize}
                pageLinkSize={pageData?.totalPages}
                first={pageRequest.offset * pageRequest.pageSize}
                dataKey="id"
                loading={loading}
                globalFilterFields={['firstName', 'lastName', 'email', 'role']}
                header={renderHeader()}
                emptyMessage={t('noUsersFound')}
                onPage={(e) => { handlePageMovement(e) }}
                onRowClick={(e) => { handleOnRowClick(e) }}
                rowClassName={() => 'hover:bg-gray-100 cursor-pointer transition duration-200'}
            >
                <Column
                    header={t('fullName')}
                    body={(rowData) => (
                        <div className='flex align-items-center'>
                            <Avatar image={getImageUrl(rowData?.profileImage?.imageUrl)} size="xlarge" shape="circle" />
                            <div className='mx-5'>
                                {rowData.firstName} {rowData.lastName}
                            </div>
                        </div>
                    )}
                />
                <Column field="email" header={t('email')} />
                <Column field="role" header={t('role')} body={roleBodyTemplate} />
                <Column field="isActive" header={t('active')} body={statusBodyTemplate} />
                <Column field="isBlocked" header={t('unblock')} body={blockBodyTemplate} />
                <Column field="createdAt" header={t('createdAt')} />
                <Column field="lastUpdated" header={t('lastUpdated')} />
            </DataTable>
        </div>
    );
}
