'use client';

import React, { useState, useEffect } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Rating } from 'primereact/rating';
import { ProductService } from '../../../demo/service/ProductService';
import { InputText } from 'primereact/inputtext';
import type { Demo } from '@/types';
import { Course, Image } from '@/app/interfaces/interfaces';
import { useAuth } from '@/app/Authentication/AuthContext';
import { getInstructorCourses } from '@/demo/service/CourseServices';

const CourseList = () => {
    const [dataViewValue, setDataViewValue] = useState<Demo.Product[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filteredValue, setFilteredValue] = useState<Demo.Product[] | null>(null);
    const [layout, setLayout] = useState<'grid' | 'list' | (string & Record<string, unknown>)>('grid');
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState<0 | 1 | -1 | null>(null);
    const [sortField, setSortField] = useState('');

    const sortOptions = [
        { label: 'Price High to Low', value: '!price' },
        { label: 'Price Low to High', value: 'price' }
    ];

    const [courses, setCourses] = useState<Course[]>([]);

    const { user } = useAuth();
    console.log(user)
    useEffect(() => {
        if (user?.id) { // Ensure that user.id is available
            const fetchCourses = async () => {
                try {
                    const courses = await getInstructorCourses(user.id);
                    setDataViewValue(courses);
                    console.log('courses:', courses);
                } catch (error) {
                    console.error('Error fetching courses:', error.message);
                }
            };
    
            fetchCourses();
        }
    }, [user]); // The useEffect will only run when 'user' changes
    


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
            <Dropdown value={sortKey} options={sortOptions} optionLabel="label" placeholder="Sort By Price" onChange={onSortChange} />
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onFilter} placeholder="Search by Name" />
            </span>
            <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
        </div>
    );

    const dataviewListItem = (data: Demo.Product) => {
        return (
            <div className="col-12">
                <div className="flex flex-column md:flex-row align-items-center p-3 w-full">
                    <img src={`/demo/images/product/${data.image}`} alt={data.name} className="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5" />
                    <div className="flex-1 flex flex-column align-items-center text-center md:text-left">
                        <div className="font-bold text-2xl">{data.name}</div>
                        <div className="mb-2">{data.description}</div>
                        <Rating value={data.rating} readOnly cancel={false} className="mb-2"></Rating>
                        <div className="flex align-items-center">
                            <i className="pi pi-tag mr-2"></i>
                            <span className="font-semibold">{data.category}</span>
                        </div>
                    </div>
                    <div className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                        <span className="text-2xl font-semibold mb-2 align-self-center md:align-self-end">${data.price}</span>
                        <Button icon="pi pi-shopping-cart" label="Add to Cart" disabled={data.inventoryStatus === 'OUTOFSTOCK'} size="small" className="mb-2"></Button>
                        <span className={`product-badge status-${data.inventoryStatus?.toLowerCase()}`}>{data.inventoryStatus}</span>
                    </div>
                </div>
            </div>
        );
    };

    // const dataviewGridItem = (data: Demo.Product) => {
    //     return (
    //         <div className="col-12 lg:col-4">
    //             <div className="card m-3 border-1 surface-border">
    //                 <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
    //                     <div className="flex align-items-center">
    //                         <i className="pi pi-tag mr-2" />
    //                         <span className="font-semibold">{data.category}</span>
    //                     </div>
    //                     <span className={`product-badge status-${data.inventoryStatus?.toLowerCase()}`}>{data.inventoryStatus}</span>
    //                 </div>
    //                 <div className="flex flex-column align-items-center text-center mb-3">
    //                     <img src={`/demo/images/product/${data.image}`} alt={data.name} className="w-9 shadow-2 my-3 mx-0" />
    //                     <div className="text-2xl font-bold">{data.name}</div>
    //                     <div className="mb-3">{data.description}</div>
    //                     <Rating value={data.rating} readOnly cancel={false} />
    //                 </div>
    //                 <div className="flex align-items-center justify-content-between">
    //                     <span className="text-2xl font-semibold">${data.price}</span>
    //                     <Button icon="pi pi-shopping-cart" disabled={data.inventoryStatus === 'OUTOFSTOCK'} />
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // };

    const getUrlImage=(image : Image)=>{
        console.log(image)
            return image?.imageUrl.split('public')[1];
    }
    
   const dataviewGridItem = (course: Course) => {
    return (
        <div className="col-12 lg:col-4">
            <div className="card m-3 border-1 surface-border">
                <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
                    <div className="flex align-items-center">
                        <i className="pi pi-book mr-2" />
                        <span className="font-semibold">{course.language.toUpperCase()}</span> {/* Display course language */}
                    </div>
                    <span className={`course-badge status-available`}>AVAILABLE</span> {/* Course status */}
                </div>
                <div className="flex flex-column align-items-center text-center mb-3">
                    {/* Display cover image */}
                    <img src={getUrlImage(course.coverImage)} alt={course.name} className="w-12 shadow-2 my-3 mx-0" />
                    <div className="text-2xl font-bold">{course.name}</div> {/* Course name */}
                    <div className="mb-3 mt-3">{`${course.instructor.firstName} ${course.instructor.lastName}`}</div> {/* Instructor name */}
                    <div className="mb-3">{course.description}</div> {/* Course description */}
                </div>
                <div className="flex align-items-center justify-content-between">
                    <span className="text-1xl font-semibold">{(course.totalHour).toString() || 0} hours</span> {/* Course duration */}
                    <Button icon="pi pi-play" /> {/* Button to start the course */}
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
           // return dataviewListItem(course);
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

export default CourseList;
