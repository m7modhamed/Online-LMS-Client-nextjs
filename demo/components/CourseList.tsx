'use client';
import React, { useState, useEffect } from 'react';
import { DataView, DataViewLayoutOptions, DataViewPageEvent } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Category, Course, Image, paginationResponse } from '@/app/interfaces/interfaces';
import { Link } from '@/i18n/routing';
import { convertHoursToSeconds, convertSecondsToHoursAndMinutes, languages } from '@/app/lib/utilities';
import { useSession } from 'next-auth/react';
import Loading from '@/app/loading';
import { useTranslations } from 'next-intl';
import { Tag } from 'primereact/tag';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { RadioButton } from 'primereact/radiobutton';

const CourseList = () => {
    const t = useTranslations('courseList');
    const [dataViewValue, setDataViewValue] = useState<Course[]>([]);
    const [layout, setLayout] = useState<'grid' | 'list' | (string & Record<string, unknown>)>('grid');
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<{ name: string; code: string }[]>([]); // State to store categories
    const { data, status } = useSession();
    const [videoDuration, setVideoDuration] = useState('');
    const [selectedCourseStatus, setSelectedCourseStatus] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const courseStatus = [
        { name: 'DRAFT', code: 'DRAFT' },
        { name: 'IN_REVIEW', code: 'IN_REVIEW' },
        { name: 'PUBLISHED', code: 'PUBLISHED' },
        { name: 'ARCHIVED', code: 'ARCHIVED' },
    ];

    if (data && data?.user.role === 'ROLE_ADMIN') {
        courseStatus.push({ name: 'DELETED', code: 'DELETED' })
    }

    const [pageRequest, setPageRequest] = useState({
        offset: 0,
        pageSize: 3,
        sortBy: '',
        sortDirection: ''
    });
    const [fillterCriteria, setFiltterCriteria] = useState<{
        "searchKey": string,
        "language": string,
        "status": string[],
        "category": string[],
        "minDuration": number,
        "maxDuration": number
    }>({
        "searchKey": "",
        "language": "",
        "status": [],
        "category": [],
        "minDuration": convertHoursToSeconds(0),
        "maxDuration": convertHoursToSeconds(150)

    });
    const [pageData, setPageData] = useState<paginationResponse>();




    useEffect(() => {
        switch (videoDuration) {
            case '0':
                setFiltterCriteria({ ...fillterCriteria, minDuration: 0, maxDuration: convertHoursToSeconds(1) })
                break;
            case '1':
                setFiltterCriteria({ ...fillterCriteria, minDuration: convertHoursToSeconds(1), maxDuration: convertHoursToSeconds(3) })
                break;
            case '2':
                setFiltterCriteria({ ...fillterCriteria, minDuration: convertHoursToSeconds(3), maxDuration: convertHoursToSeconds(6) })
                break;
            case '3':
                setFiltterCriteria({ ...fillterCriteria, minDuration: convertHoursToSeconds(6), maxDuration: convertHoursToSeconds(17) })
                break;
            case '4':
                setFiltterCriteria({ ...fillterCriteria, minDuration: convertHoursToSeconds(17) })
                break;

        }
    }, [videoDuration])


    useEffect(() => {
        setLoading(true);
        const getCategories = async () => {
            if (!data) {
                return;
            }
            try {
                const res = await fetch(API_ROUTES.CATEGORIES.GET_CATEGORY, {
                    headers: {
                        Authorization: `Bearer ${data.accessToken}`
                    },
                    cache: 'no-store'
                });
                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.message || 'Error fetching categories');
                }

                const categories = await res.json();

                const formattedCategories = categories.map((category: Category) => ({
                    name: category.name,
                    code: category.name
                }));
                setCategories(formattedCategories);
            } catch (err: any) {
                //console.log(err.message || 'Error fetching categories');
            } finally {
                setLoading(false);
            }
        };

        getCategories();
    }, [data]);

    useEffect(() => {
        const endPointSearch = `offset=${pageRequest.offset}&pageSize=${pageRequest.pageSize}&sortBy=${pageRequest.sortBy}&sortDirection=${pageRequest.sortDirection}`
        const endPoint =
            data?.user.role === 'ROLE_INSTRUCTOR'
                ? `${API_ROUTES.COURSES.GET_INSTRUCTOR_COURSES(data.user.id)}?${endPointSearch}`
                : data?.user.role === 'ROLE_ADMIN'
                    ? `${API_ROUTES.COURSES.GET_ALL_COURSES_FOR_ADMIN}?${endPointSearch}`
                    : `${API_ROUTES.COURSES.GET_ALL_COURSES}?${endPointSearch}`;

        const fetchcourses = async () => {

            try {
                if (!data) {
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
    }, [data, pageRequest, fillterCriteria]);


    if (loading || status === 'loading') {
        return <Loading />;
    }
    const onSearchFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFiltterCriteria({ ...fillterCriteria, "searchKey": value })

    };


    const getUrlImage = (image: Image) => {
        return image?.imageUrl.split('public')[1];
    };

    const handleLanguageChange = (e: { value: string }) => {
        if (e.value === 'all') {
            setFiltterCriteria({ ...fillterCriteria, "language": '' })
        } else {

            setFiltterCriteria({ ...fillterCriteria, "language": e.value })
        }
    };

    const onSelectCourseStatus = (e: MultiSelectChangeEvent) => {
        setSelectedCourseStatus(e.value)

        setFiltterCriteria((prevState) => {
            const selectedArray: { name: string; code: string }[] = e.value;

            const updatedStatus = selectedArray.map((val) => val.code);

            return { ...prevState, status: updatedStatus };
        });
    }
    const onSelectCategory = (e: MultiSelectChangeEvent) => {
        setSelectedCategory(e.value)

        setFiltterCriteria((prevState) => {
            const selectedArray: { name: string; code: string }[] = e.value;

            const updatedCategory = selectedArray.map((val) => val.code);

            return { ...prevState, category: updatedCategory };
        });
    }

    const dataViewHeader = (
        <>
            <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={fillterCriteria.searchKey} onChange={onSearchFilter} placeholder={t('search.placeholder')} />
                </span>

                <Dropdown className='w-2' id="language" name="language" value={fillterCriteria.language} options={[{ label: 'All', value: 'all' }, ...languages]} onChange={handleLanguageChange} placeholder={t('language')} />

                {data?.user.role !== 'ROLE_STUDENT' &&
                    <MultiSelect value={selectedCourseStatus}
                        onChange={(e) => onSelectCourseStatus(e)}
                        options={courseStatus}
                        optionLabel="name"
                        display="chip"
                        placeholder={t('status')}
                        maxSelectedLabels={3}
                        className="w-full md:w-22rem"
                    />
                }

                <MultiSelect value={selectedCategory}
                    onChange={(e) => onSelectCategory(e)}
                    options={categories}
                    optionLabel="name"
                    display="chip"
                    placeholder={t('category')}
                    maxSelectedLabels={3}
                    className="w-full md:w-22rem"
                />

                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
            </div>

            <div className="flex flex-column md:flex-row md:justify-content-start gap-8 mt-4">

                <h5 className='text-red'>{t('duration')}</h5>

                <div >
                    <RadioButton inputId="duration1" name="pizza" value="0" onChange={(e) => setVideoDuration(e.value)} checked={videoDuration === '0'} />
                    <label htmlFor="duration1" className="mx-2">0-1 {t('hour')}</label>
                </div>
                <div >
                    <RadioButton inputId="duration2" name="pizza" value="1" onChange={(e) => setVideoDuration(e.value)} checked={videoDuration === '1'} />
                    <label htmlFor="duration2" className="mx-2">1-3 {t('hour')}</label>
                </div>
                <div >
                    <RadioButton inputId="duration3" name="pizza" value="2" onChange={(e) => setVideoDuration(e.value)} checked={videoDuration === '2'} />
                    <label htmlFor="duration3" className="mx-2">3-6 {t('hour')}</label>
                </div>
                <div >
                    <RadioButton inputId="duration4" name="pizza" value="3" onChange={(e) => setVideoDuration(e.value)} checked={videoDuration === '3'} />
                    <label htmlFor="duration4" className="mx-2">6-17 {t('hour')}</label>
                </div>
                <div >
                    <RadioButton inputId="duration5" name="pizza" value="4" onChange={(e) => setVideoDuration(e.value)} checked={videoDuration === '4'} />
                    <label htmlFor="duration5" className="mx-2">+17 {t('hour')}</label>
                </div>
            </div>
        </>
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
                        {course?.status && data?.user.role !== "ROLE_STUDENT" &&
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

                        <Link href={data?.user?.role === 'ROLE_INSTRUCTOR' ? `/dashboard/instructor/courses/${course.id}` : data?.user.role === "ROLE_ADMIN" ? `/dashboard/admin/courses/${course.id}` : `/dashboard/student/courses/${course.id}`}>
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
                        {course?.status && data?.user.role !== "ROLE_STUDENT" &&
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
                        <Link href={data?.user?.role === 'ROLE_INSTRUCTOR' ? `/dashboard/instructor/courses/${course.id}` : data?.user.role === "ROLE_ADMIN" ? `/dashboard/admin/courses/${course.id}` : `/dashboard/student/courses/${course.id}`}>
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
