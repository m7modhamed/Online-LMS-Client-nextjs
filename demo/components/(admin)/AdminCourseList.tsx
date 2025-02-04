'use client';
import React, { useState, useEffect } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Course, Image } from '@/app/interfaces/interfaces';
import { Link } from '@/i18n/routing';
import { convertSecondsToHoursAndMinutes } from '@/app/utility/utilities';
import { useSession } from 'next-auth/react';
import { Tag } from 'primereact/tag';
import { CustomSession } from '@/app/interfaces/customSession';
import Loading from '@/app/loading';

const AdminCourseList = ({ courses }: { courses: Course[] }) => {
    const [dataViewValue, setDataViewValue] = useState<Course[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filteredValue, setFilteredValue] = useState<Course[] | null>(null);
    const [layout, setLayout] = useState<'grid' | 'list' | (string & Record<string, unknown>)>('grid');
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState<0 | 1 | -1 | null>(null);
    const [sortField, setSortField] = useState('');
    const [loading, setLoading] = useState(true);
    const sortOptions = [
        { label: 'Enrolled Students: High to Low', value: '!enrolledStudentsNumber' },
        { label: 'Enrolled Students: Low to High', value: 'enrolledStudentsNumber' }
    ];

    const { data, status } = useSession() as { data: CustomSession; status: string };
    const user = data?.user;
    useEffect(() => {
        setDataViewValue(courses);
        setLoading(false);
    }, [user, dataViewValue, courses]);

    if (loading) {
        return <Loading />;
    }

    const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
        if (value.length === 0) {
            setFilteredValue(null);
        } else {
            const filtered = dataViewValue?.filter((product) => {
                const productNameLowercase = product.name.toLowerCase();
                const searchValueLowercase = value.toLowerCase();
                return productNameLowercase.includes(searchValueLowercase);
            });

            setFilteredValue(filtered);
        }
    };

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

    const dataViewHeader = (
        <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
            <Dropdown value={sortKey} options={sortOptions} optionLabel="label" placeholder="Sort By Enrolled Students" onChange={onSortChange} />
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onFilter} placeholder="Search by Name" />
            </span>
            <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
        </div>
    );

    const getUrlImage = (image: Image) => {
        console.log(image);
        return image?.imageUrl.split('public')[1];
    };

    const dataviewListItem = (course: Course) => {
        const { coverImage, name, description, category, enrolledStudentsNumber, instructor, language, duration } = course;
        const { firstName, lastName } = instructor || {};

        return (
            <div className="col-12">
                <div className="flex flex-column md:flex-row align-items-center p-3 w-full">
                    {/* Course Image */}
                    <div>
                        <img src={getUrlImage(coverImage)} alt={name} className="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5" style={{ objectFit: 'cover', height: '150px' }} />
                    </div>

                    {/* Course Details */}
                    <div className="flex-1 flex flex-column align-items-center text-center md:text-left">
                        <div className="font-bold text-2xl mb-4">{name}</div> {/* Course name */}
                        <div className="mb-2">{description}</div> {/* Course description */}
                        {/* Language and Instructor */}
                        <div className="flex align-items-center mt-3">
                            <i className="pi pi-book mr-2" />
                            <span className="font-semibold">{language?.toUpperCase()}</span> {/* Course language */}
                        </div>
                        <Tag
                            className="mt-4"
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
                                                    : null
                            }
                            icon={course?.status == 'PUBLISHED' ? 'pi pi-check' : ''}
                            value={course?.status?.toUpperCase()}
                        />
                    </div>

                    {/* Right Section - Enrolled Students, Add to Cart, Duration */}
                    <div style={{ gap: '10px', flexWrap: 'wrap' }} className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                        <span className="text-2xl font-semibold mb-2 align-self-center md:align-self-end">{enrolledStudentsNumber.toString()} Students</span>

                        {/* Duration */}
                        <div className="flex align-items-center mb-2">
                            <i className="pi pi-clock" style={{ fontSize: '1.5rem' }}></i>
                            <span className="text-1xl font-semibold ml-2">{convertSecondsToHoursAndMinutes(Number(course.duration))}</span>
                        </div>

                        {/* Button to open */}
                        <Link href={`/dashboard/admin/courses/${course.id}`}>
                            {/* <Button icon="pi pi-play" /> */}
                            <Button icon="pi pi-play" label="Open Course" size="small" className="mb-2" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    const dataviewGridItem = (course: Course) => {
        return (
            <div className="col-12 lg:col-6 flex mb-6">
                <div className="card m-3 border-1 surface-border flex flex-column ">
                    <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-4">
                        <div className="flex align-items-center">
                            <i className="pi pi-book mr-2" />
                            <span className="font-semibold">{course.language.toUpperCase()}</span> {/* Display course language */}
                        </div>
                        <span className={`course-badge status-available`}>{course.enrolledStudentsNumber.toString()} students</span> {/* Course status */}

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
                        {/* Image container with fixed height */}
                        <div className="image-container w-12 h-12 flex align-items-center justify-content-center overflow-hidden" style={{ height: '250px' }}>
                            <img src={getUrlImage(course.coverImage)} alt={course.name} className="w-full h-full" style={{ objectFit: 'cover' }} />
                        </div>
                        <div className="text-2xl font-bold mt-2">{course.name}</div> {/* Course name */}
                        <div className="mb-3 mt-3">{`${course?.instructor?.firstName} ${course?.instructor?.lastName}`}</div> {/* Instructor name */}
                        <div className="">{course.description}</div> {/* Course description */}
                    </div>
                    <div className="flex align-items-center justify-content-between mt-2" style={{ flexWrap: 'wrap', gap: '20px' }}>
                        <div className="flex align-items-center" style={{ gap: '8px' }}>
                            <i className="pi pi-clock " style={{ fontSize: '1.5rem' }}></i>

                            <span className="text-1xl font-semibold">{convertSecondsToHoursAndMinutes(Number(course.duration))}</span>
                        </div>
                        <Link href={`/dashboard/admin/courses/${course.id}`}>
                            {/* <Button icon="pi pi-play" /> */}
                            <Button icon="pi pi-play" label="Open Course" size="small" />
                        </Link>
                        {/* Button to start the course */}
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
                    <h5>DataView</h5>
                    <DataView value={filteredValue || dataViewValue} layout={layout} paginator rows={9} sortOrder={sortOrder} sortField={sortField} itemTemplate={itemTemplate} header={dataViewHeader}></DataView>
                </div>
            </div>
        </div>
    );
};

export default AdminCourseList;
