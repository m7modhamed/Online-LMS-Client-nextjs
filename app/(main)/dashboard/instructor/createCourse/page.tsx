'use client';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Chip } from 'primereact/chip';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useState, ChangeEvent, KeyboardEvent, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { createCourseValidationSchema } from './ValidationSchema';
import { Message } from 'primereact/message';
import { useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';
import { API_ROUTES } from '@/app/api/apiRoutes';
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/interfaces/customSession';
import { Category, Course } from '@/app/interfaces/interfaces';
import Loading from '@/app/loading';
import { revalidatePath } from 'next/cache';

interface ICourseData {
    name: string;
    category: { id: string; name: string } | null;
    prerequisites: string[];
    language: string | null;
    description: string;
}
interface ICourseDataError {
    name?: string;
    category?: string;
    prerequisites?: string;
    language?: string;
    description?: string;
    coverImage?: string;
}

const CreateCourse: React.FC = () => {
    const initialCourse = {
        name: '',
        category: null,
        prerequisites: [],
        language: null,
        description: ''
    };

    const [courseData, setCourseData] = useState<ICourseData>(initialCourse);
    const { data, status } = useSession() as { data: CustomSession; status: string };
    const [prerequisiteInput, setPrerequisiteInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState<{ label: string; value: string }[]>([]); // State to store categories
    const router = useRouter();

    const [courseDataError, setCourseDataError] = useState<ICourseDataError>({
        category: '',
        prerequisites: '',
        language: '',
        description: '',
        name: '',
        coverImage: ''
    });

    const languages = [
        { label: 'English', value: 'english' },
        { label: 'Spanish', value: 'spanish' },
        { label: 'French', value: 'french' }
    ];

    const handleCategoryChange = (e: { value: { id: string; name: string } | null }) => {
        if (e.value) {
            setCourseData((prevData) => ({
                ...prevData,
                category: e.value
            }));
            setCourseDataError({ ...courseDataError, category: '' });
        }
    };

    const handleLanguageChange = (e: { value: string | null }) => {
        setCourseData((prevData) => ({ ...prevData, language: e.value }));
        setCourseDataError({ ...courseDataError, language: '' });
    };

    const handlePrerequisiteChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPrerequisiteInput(e.target.value);

        prerequisitesValidation();
    };

    const prerequisitesValidation = () => {
        createCourseValidationSchema
            .validateAt('prerequisites', { ...courseData, prerequisites: [...courseData.prerequisites, prerequisiteInput] })
            .then(() => {
                setCourseDataError((prevCourseData) => ({
                    ...prevCourseData,
                    prerequisites: ''
                }));
            })
            .catch((err) => {
                setCourseDataError((prevCourseData) => ({
                    ...prevCourseData,
                    prerequisites: err.message
                }));
            });
    };

    const handleAddPrerequisite = () => {
        if (prerequisiteInput.trim() !== '') {
            setCourseData((prevData) => {
                const updatedPrerequisites = [...prevData.prerequisites, prerequisiteInput];
                return { ...prevData, prerequisites: updatedPrerequisites };
            });

            setPrerequisiteInput('');

            prerequisitesValidation();
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && prerequisiteInput.trim() !== '') {
            handleAddPrerequisite();
        }
    };

    useEffect(() => {
        setIsLoading(true);
        const getCategories = async () => {
            try {
                const res = await fetch(API_ROUTES.CATEGORIES.GET_CATEGORY, {
                    headers: {
                        Authorization: `Bearer ${data.accessToken}`
                    }
                });
                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.message || 'Error fetching categories');
                }

                const categories = await res.json();

                const formattedCategories = categories.map((category: Category) => ({
                    label: category.name,
                    value: category
                }));
                setCategories(formattedCategories);
            } catch (err: any) {
                setError(err.message || 'Error fetching categories');
            } finally {
                setIsLoading(false);
            }
        };

        getCategories();
    }, [data]);

    const handleDeletePrerequisite = (prerequisite: string) => {
        setCourseData((prevData) => {
            const updatedPrerequisites = prevData.prerequisites.filter((item) => item !== prerequisite);
            return {
                ...prevData,
                prerequisites: updatedPrerequisites
            };
        });
    };
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setCoverImage(acceptedFiles[0]);
            setCourseDataError({ ...courseDataError, coverImage: '' });
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCourseData((prevCourseData) => {
            const updatedCourseData = { ...prevCourseData, [name]: value.trim() };

            createCourseValidationSchema
                .validateAt(name, updatedCourseData)
                .then(() => {
                    setCourseDataError((prevCourseData) => ({
                        ...prevCourseData,
                        [name]: ''
                    }));
                })
                .catch((err) => {
                    setCourseDataError((prevCourseData) => ({
                        ...prevCourseData,
                        [name]: err.message
                    }));
                });

            return updatedCourseData;
        });
    };

    const createCourse = async (formData: FormData) => {
        try {
            const res = await fetch(API_ROUTES.COURSES.CREATE_COURSE, {
                headers: {
                    Authorization: `Bearer ${data.accessToken}`
                },
                body: formData,
                method: 'post'
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error);
            }
            return await res.json();
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleSubmit = async () => {
        console.log('Form Submitted', courseData);
        console.log('image', coverImage);

        setIsLoading(true);
        try {
            await createCourseValidationSchema.validate(
                { ...courseData, coverImage },
                {
                    abortEarly: false
                }
            );

            const formData = new FormData();

            if (coverImage) {
                formData.append('image', coverImage);
            }
            const courseBlob = new Blob([JSON.stringify(courseData)], { type: 'application/json' });

            formData.append('course', courseBlob);

            const createdCourse: Course = await createCourse(formData);

            console.log(createdCourse);
            showSuccess('Success', 'course added successfully');
            resetForm();
            setTimeout(() => {
                router.push(`/dashboard/instructor/courses/${createdCourse.id}`);
            }, 1000);
            revalidatePath('/dashboard/instructor/courses');
            setIsLoading(false);
        } catch (error: any) {
            setIsLoading(false);
            if (error.name === 'ValidationError') {
                const errors: ICourseDataError = {};
                error.inner.forEach((err: any) => {
                    if (err.path) {
                        errors[err.path as keyof ICourseDataError] = err.message;
                    }
                });
                setCourseDataError(errors);
            } else {
                showError('Error', error.message);
            }
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/jpeg, image/png',
        maxSize: 5000000
    });
    const toast = useRef<Toast>(null);

    const showError = (title: string, desc: string) => {
        toast.current?.show({
            severity: 'error',
            summary: title,
            detail: desc,
            life: 5000
        });
    };
    const showSuccess = (title: string, desc: string) => {
        toast.current?.show({
            severity: 'success',
            summary: title,
            detail: desc,
            life: 5000
        });
    };
    const resetForm = () => {
        setCourseData(initialCourse);
        setCoverImage(null);
    };
    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <h5>Create Course</h5>
                    <p>Use this page to create a new course by filling out the form below.</p>
                </div>
            </div>
            <div className="card p-fluid col-12">
                <h5>Course Details</h5>
                <div className="formgrid grid">
                    <div className="field col-12">
                        <label htmlFor="name">Course Name</label>
                        <InputText id="name" name="name" value={courseData.name} onChange={handleInputChange} />
                        {courseDataError.name && <Message style={{ marginTop: '10px' }} severity="error" text={courseDataError.name} />}
                    </div>

                    <div className="field col-6">
                        <label htmlFor="category">Category</label>
                        <Dropdown id="category" name="category" value={courseData.category} options={categories} onChange={handleCategoryChange} optionLabel="label" optionValue="value" placeholder="Select a Category" disabled={isLoading} />
                        {courseDataError.category && <Message style={{ marginTop: '10px' }} severity="error" text={courseDataError.category} />}
                    </div>

                    {/* Language */}
                    <div className="field col-6">
                        <label htmlFor="language">Language</label>
                        <Dropdown id="language" name="language" value={courseData.language} options={languages} onChange={handleLanguageChange} placeholder="Select a Language" />
                        {courseDataError.language && <Message style={{ marginTop: '10px' }} severity="error" text={courseDataError.language} />}
                    </div>

                    <div className="field col-12">
                        <label htmlFor="prerequisites">Prerequisites</label>
                        <div className="p-inputgroup">
                            <InputText id="prerequisites" name="prerequisites" value={prerequisiteInput} onChange={handlePrerequisiteChange} onKeyDown={handleKeyDown} placeholder="Enter prerequisite" />
                            <Button label="Add" icon="pi pi-plus" onClick={handleAddPrerequisite} />
                        </div>
                        {courseDataError.prerequisites && <Message style={{ marginTop: '10px' }} severity="error" text={courseDataError.prerequisites} />}

                        <div className="mt-2">
                            {courseData.prerequisites.map((prerequisite, index) => (
                                <Chip
                                    key={index}
                                    label={prerequisite}
                                    className="mr-2"
                                    removable
                                    onRemove={() => handleDeletePrerequisite(prerequisite)} // Delete by prerequisite value
                                />
                            ))}
                        </div>
                    </div>

                    <div className="field col-12">
                        <label htmlFor="description">Description</label>
                        <InputTextarea id="description" name="description" value={courseData.description} onChange={handleInputChange} placeholder="Provide a brief course description" rows={5} cols={30} />
                        {courseDataError.description && <Message style={{ marginTop: '10px' }} severity="error" text={courseDataError.description} />}
                    </div>

                    <div className="field col-12">
                        <label htmlFor="photo">Course Photo</label>
                        <div
                            {...getRootProps()}
                            className="upload-container p-d-flex p-flex-column p-ai-center p-jc-center"
                            style={{
                                border: '2px dashed #ccc',
                                borderRadius: '8px',
                                padding: '20px',
                                cursor: 'pointer'
                            }}
                        >
                            <input {...getInputProps()} />
                            <p>Drag & drop an image here, or click to select one</p>
                        </div>
                        {courseDataError.coverImage && <Message style={{ marginTop: '10px' }} severity="error" text={courseDataError.coverImage} />} {/* Show preview of selected photo */}
                        {coverImage && (
                            <div className="mt-2">
                                <img src={URL.createObjectURL(coverImage)} alt="Course Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', margin: 'auto', display: 'block' }} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="formgrid grid">
                    <div className="field col-6 m-auto">
                        <Button label="Submit" icon="pi pi-check" className="p-button-success" loading={isLoading} onClick={handleSubmit} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCourse;
