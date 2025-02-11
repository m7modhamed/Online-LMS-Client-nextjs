'use client';
import React, { useState, useEffect } from 'react';
import { DataView, DataViewLayoutOptions, DataViewPageEvent } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Course, Image, paginationResponse } from '@/app/interfaces/interfaces';
import { Link } from '@/i18n/routing';
import { convertSecondsToHoursAndMinutes } from '@/app/lib/utilities';
import { useSession } from 'next-auth/react';
import Loading from '@/app/loading';
import { useTranslations } from 'next-intl';
import { Tag } from 'primereact/tag';
import { Icon } from '@mui/material';

const CourseList = () => {
    const t = useTranslations('courseList');

    const [dataViewValue, setDataViewValue] = useState<Course[]>([]);
    const [layout, setLayout] = useState<'grid' | 'list' | (string & Record<string, unknown>)>('grid');
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState<0 | 1 | -1 | null>(null);
    const [sortField, setSortField] = useState('');
    const [loading, setLoading] = useState(true);
    const { data, status } = useSession();
    const [pageRequest, setPageRequest] = useState({
        offset: 0,
        pageSize: 6,
        sortBy: '',
        sortDirection: ''
    });
    const [fillterCriteria, setFiltterCriteria] = useState({
        "searchKey": "",
        "language": "",
        "status": "",
        "category": [],
        "minDuration": "",
        "maxDuration": ""

    });
    const [pageData, setPageData] = useState<paginationResponse>();

    const user = data?.user;

    const sortOptions = [
        { label: t('sort.highToLow'), value: '!enrolledStudentsNumber' },
        { label: t('sort.lowToHigh'), value: 'enrolledStudentsNumber' }
    ];

    useEffect(() => {
        const endPointSearch = `offset=${pageRequest.offset}&pageSize=${pageRequest.pageSize}&sortBy=${pageRequest.sortBy}&sortDirection=${pageRequest.sortDirection}`
        const endPoint = data?.user.role === 'ROLE_INSTRUCROT'
            ? `http://localhost:8080/instructor/${data.user.id}/courses?${endPointSearch}`
            : `http://localhost:8080/admin/courses?${endPointSearch}`;
        const fetchcourses = async () => {
            try {
                const userId = data?.user?.id;
                if (!userId) {
                    return;
                }
                setLoading(true);
                const res = await fetch(endPoint, {
                    headers: {
                        Authorization: `Bearer ${data?.accessToken}`,
                        "Content-Type": "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify(fillterCriteria)
                });

                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.message);
                }
                const response = await res.json();
                console.log('response', response)
                setPageData(response)
                setDataViewValue(response.content);
            } catch (err: any) {
                console.error('', err.message);
            } finally {

                setLoading(false);
            }

        }
        fetchcourses();
    }, [data, user, pageRequest, fillterCriteria]);


    if (loading) {
        return <Loading />;
    }
    const onSearchFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFiltterCriteria({ ...fillterCriteria, "searchKey": value })

    };

    console.log('fillterCriteria', fillterCriteria)

    const onSortChange = (event: DropdownChangeEvent) => {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            setSortOrder(-1);
            setSortField(value.substring(1, value.length));
            setSortKey(value);
        } else {
            setSortOrder(1);
            setSortField(value);
            setSortKey(value);
        }
    };

    const getUrlImage = (image: Image) => {
        return image?.imageUrl.split('public')[1];
    };

    const dataViewHeader = (
        <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
            <Dropdown value={sortKey} options={sortOptions} optionLabel="label" placeholder={t('sort.placeholder')} onChange={onSortChange} />
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={fillterCriteria.searchKey} onChange={onSearchFilter} placeholder={t('search.placeholder')} />
            </span>
            <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
        </div>
    );

    const handlePageMovement = (e: DataViewPageEvent) => {
        const { page } = e;
        setPageRequest({ ...pageRequest, "offset": page })
    }

    const dataviewListItem = (course: Course) => {
        return (
            <div className="col-12">
                <div className="flex flex-column md:flex-row align-items-center p-3 w-full">
                    <div>
                        <img src={getUrlImage(course.coverImage)} alt={course.name} className="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5" style={{ objectFit: 'cover', height: '150px' }} />
                    </div>

                    <div className="flex-1 flex flex-column align-items-center text-center md:text-left">
                        <div className="font-bold text-2xl mb-4">{course.name}</div>
                        <div style={{ wordBreak: 'break-all' }} className="mb-2">
                            {course.description}
                        </div>{' '}
                        <div className="flex align-items-center my-3">
                            <i className="pi pi-book mr-2" />
                            <span className="font-semibold ">{course.language?.toUpperCase()}</span>
                        </div>
                        {course?.status &&
                            <Tag
                                severity={
                                    course?.status === 'PUBLISHED'
                                        ? 'success'
                                        : course?.status === 'IN_REVIEW'
                                            ? 'info'
                                            : course?.status === 'DRAFT'
                                                ? 'warning'
                                                : course?.status === 'ARCHIVED'
                                                    ? null
                                                    : course?.status === 'DELETED'
                                                        ? 'danger'
                                                        : null
                                }
                                icon={course?.status == 'PUBLISHED' ? 'pi pi-check' : ''}
                                value={course?.status?.toUpperCase()}
                            />
                        }
                    </div>

                    <div style={{ gap: '10px', flexWrap: 'wrap' }} className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                        <span className="text-2xl font-semibold mb-2 align-self-center md:align-self-end">{course.enrolledStudentsNumber.toString()} {t('students')}</span>

                        <div className="flex align-items-center mb-2">
                            <i className="pi pi-clock" style={{ fontSize: '1.5rem' }}></i>
                            <span className="text-1xl font-semibold ml-2">{convertSecondsToHoursAndMinutes(Number(course.duration))}</span>
                        </div>

                        <Link href={data?.user?.role === 'ROLE_INSTRUCTOR' ? `/dashboard/instructor/courses/${course.id}` : `/dashboard/admin/courses/${course.id}`}>
                            <Button icon="pi pi-play" label={t('openToEnroll')} size="small" className="mb-2" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    const dataviewGridItem = (course: Course) => {
        return (
            <div className="col-12 lg:col-4">
                <div className="card m-3 border-1 surface-border">
                    <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
                        <div className="flex align-items-center">
                            <i className="pi pi-tag mr-2" />
                            <span className="font-semibold">{course.language.toUpperCase()}</span>
                        </div>

                        <span className={`course-badge status-available`}>{course.enrolledStudentsNumber.toString()} {t('students')}</span>
                        {course?.status &&
                            <Tag
                                severity={
                                    course?.status === 'PUBLISHED'
                                        ? 'success'
                                        : course?.status === 'IN_REVIEW'
                                            ? 'info'
                                            : course?.status === 'DRAFT'
                                                ? 'warning'
                                                : course?.status === 'ARCHIVED'
                                                    ? null // Use null for "ARCHIVED"
                                                    : course?.status === 'DELETED'
                                                        ? 'danger'
                                                        : null // Use null for "DELETED"
                                }
                                icon={course?.status == 'PUBLISHED' ? 'pi pi-check' : ''}
                                value={course?.status?.toUpperCase()}
                            />
                        }
                    </div>
                    <div className="flex flex-column align-items-center text-center mb-3">
                        <div className="image-container w-12 h-12 flex align-items-center justify-content-center overflow-hidden" style={{ height: '250px' }}>
                            <img src={getUrlImage(course.coverImage)} alt={course.name} className="w-full h-full" style={{ objectFit: 'cover' }} />
                        </div>
                        <div className="text-2xl font-bold mt-2">{course.name}</div>
                        <div className="mb-3 mt-3">{`${course.instructor.firstName} ${course.instructor.lastName}`}</div>
                        <div style={{ wordBreak: 'break-all' }}>{course.description}</div>
                    </div>
                    <div className="flex align-items-center justify-content-between mt-2" style={{ flexWrap: 'wrap', gap: '20px' }}>
                        <div className="flex align-items-center" style={{ gap: '8px' }}>
                            <i className="pi pi-clock " style={{ fontSize: '1.5rem' }}></i>

                            <span className="text-1xl font-semibold">{convertSecondsToHoursAndMinutes(Number(course.duration))}</span>
                        </div>
                        <Link href={data?.user?.role === 'ROLE_INSTRUCTOR' ? `/dashboard/instructor/courses/${course.id}` : `/dashboard/admin/courses/${course.id}`}>
                            <Button icon="pi pi-play" label={t('openToEnroll')} size="small" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (course: Course, layout: 'grid' | 'list' | (string & Record<string, unknown>)) => {
        if (!course) {
            return;
        }

        if (layout === 'list') {
            return dataviewListItem(course);
        } else if (layout === 'grid') {
            return dataviewGridItem(course);
        }
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>{t('courses')}</h5>
                    <DataView
                        value={dataViewValue}
                        alwaysShowPaginator
                        paginator
                        lazy
                        totalRecords={pageData?.totalElements}
                        rows={pageData?.pageable.pageSize}
                        pageLinkSize={pageData?.totalPages}
                        first={pageRequest.offset * pageRequest.pageSize}
                        layout={layout}
                        sortOrder={sortOrder}
                        sortField={sortField}
                        itemTemplate={itemTemplate}
                        header={dataViewHeader}
                        onPage={(e) => handlePageMovement(e)}
                    />
                </div>
            </div>

        </div>
    );
};

export default CourseList;
