'use client';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Chip } from 'primereact/chip'; // To display prerequisites as chips
import { InputTextarea } from 'primereact/inputtextarea'; // For multi-line description input
import React, { useState, ChangeEvent, KeyboardEvent, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone'; // Import react-dropzone for modern file upload
import { createCourse, getCategories } from '@/demo/service/CourseServices'; // Import the function to fetch categories
import { createCourseValidationSchema } from './ValidationSchema';
import { Message } from 'primereact/message';
import { useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';

interface ICourseData {
    name: string;
    category: { id: string; name: string } | null; // Adjusted to store the full object
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

    const [prerequisiteInput, setPrerequisiteInput] = useState<string>(''); // Input value for prerequisites
    const [isLoading, setIsLoading] = useState(false);
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

    // Handle dropdown change for category
    const handleCategoryChange = (e: { value: { id: string; name: string } | null }) => {
        if (e.value) {
            setCourseData((prevData) => ({
                ...prevData,
                category: e.value // Set the entire category object
            }));
            setCourseDataError({ ...courseDataError, category: '' });
        }
    };

    // Handle dropdown change for language
    const handleLanguageChange = (e: { value: string | null }) => {
        setCourseData((prevData) => ({ ...prevData, language: e.value }));
        setCourseDataError({ ...courseDataError, language: '' });
    };

    // Handle prerequisite input change
    const handlePrerequisiteChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPrerequisiteInput(e.target.value); // Update input value for prerequisites

        // Now validate the updated state
        prerequisitesValidation();
    };

    const prerequisitesValidation = () => {
        createCourseValidationSchema
            .validateAt('prerequisites', { ...courseData, prerequisites: [...courseData.prerequisites, prerequisiteInput] })
            .then(() => {
                // If validation is successful, clear error message
                setCourseDataError((prevCourseData) => ({
                    ...prevCourseData,
                    prerequisites: ''
                }));
            })
            .catch((err) => {
                // If validation fails, set error message
                setCourseDataError((prevCourseData) => ({
                    ...prevCourseData,
                    prerequisites: err.message
                }));
            });
    };
    // Handle adding a prerequisite to the list
    const handleAddPrerequisite = () => {
        if (prerequisiteInput.trim() !== '') {
            // First update the state
            setCourseData((prevData) => {
                const updatedPrerequisites = [...prevData.prerequisites, prerequisiteInput];
                return { ...prevData, prerequisites: updatedPrerequisites };
            });

            // Then clear the input field after adding
            setPrerequisiteInput('');

            // Now validate the updated state
            prerequisitesValidation();
        }
    };

    // Handle key down for prerequisites input (allowing Enter key)
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && prerequisiteInput.trim() !== '') {
            handleAddPrerequisite();
        }
    };

    // Fetch categories on component mount
    useEffect(() => {
        setIsLoading(true);
        getCategories()
            .then((retrievedCategories) => {
                console.log('Categories:', retrievedCategories);
                // Map categories to the format required by the Dropdown component
                const formattedCategories = retrievedCategories.map((category: any) => ({
                    label: category.name, // Display name in the dropdown
                    value: category // Store the whole category object in value
                }));
                setCategories(formattedCategories); // Update state with formatted categories
            })
            .catch((error) => {
                console.error('Error fetching categories:', error.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    // Handle prerequisite deletion
    const handleDeletePrerequisite = (prerequisite: string) => {
        setCourseData((prevData) => {
            // Filter out the prerequisite by its value
            const updatedPrerequisites = prevData.prerequisites.filter((item) => item !== prerequisite);
            return {
                ...prevData,
                prerequisites: updatedPrerequisites
            };
        });
    };
    const [coverImage, setCoverImage] = useState<File | null>(null); // Store a single file

    // Handle photo selection using react-dropzone
    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setCoverImage(acceptedFiles[0]); // Store the first file from the array
            setCourseDataError({ ...courseDataError, coverImage: '' });
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCourseData((prevCourseData) => {
            const updatedCourseData = { ...prevCourseData, [name]: value.trim() };

            // Validate the field on change using Yup schema
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
                formData.append('image', coverImage); // Include the file name
            }
            const courseBlob = new Blob([JSON.stringify(courseData)], { type: 'application/json' });

            formData.append('course', courseBlob);

            const newCourse = await createCourse(formData);

            console.log(newCourse);
            showSuccess('Success', 'course added successfully');
            resetForm();
            setTimeout(() => {
                 router.push(`/dashboard/instructor/courses/${newCourse.id}`);
            }, 1000);

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

    // Dropzone settings
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/jpeg, image/png', // Allow only images
        maxSize: 5000000 // Max file size: 5MB,
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
                    {/* Course Name */}
                    <div className="field col-12">
                        <label htmlFor="name">Course Name</label>
                        <InputText id="name" name="name" value={courseData.name} onChange={handleInputChange} />
                        {courseDataError.name && <Message style={{ marginTop: '10px' }} severity="error" text={courseDataError.name} />}
                    </div>

                    {/* Category */}
                    <div className="field col-6">
                        <label htmlFor="category">Category</label>
                        <Dropdown
                            id="category"
                            name="category"
                            value={courseData.category} // The value is now an object { id, name }
                            options={categories} // options are { id, name }
                            onChange={handleCategoryChange} // Handle category object change
                            optionLabel="label" // Display 'name' of the category
                            optionValue="value" // Store 'id' as the selected value (though we store the whole object)
                            placeholder="Select a Category"
                            disabled={isLoading}
                        />
                        {courseDataError.category && <Message style={{ marginTop: '10px' }} severity="error" text={courseDataError.category} />}
                    </div>

                    {/* Language */}
                    <div className="field col-6">
                        <label htmlFor="language">Language</label>
                        <Dropdown id="language" name="language" value={courseData.language} options={languages} onChange={handleLanguageChange} placeholder="Select a Language" />
                        {courseDataError.language && <Message style={{ marginTop: '10px' }} severity="error" text={courseDataError.language} />}
                    </div>

                    {/* Prerequisites */}
                    <div className="field col-12">
                        <label htmlFor="prerequisites">Prerequisites</label>
                        <div className="p-inputgroup">
                            <InputText id="prerequisites" name="prerequisites" value={prerequisiteInput} onChange={handlePrerequisiteChange} onKeyDown={handleKeyDown} placeholder="Enter prerequisite" />
                            <Button label="Add" icon="pi pi-plus" onClick={handleAddPrerequisite} />
                        </div>
                        {courseDataError.prerequisites && <Message style={{ marginTop: '10px' }} severity="error" text={courseDataError.prerequisites} />}
                        {/* Display added prerequisites with delete button */}
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

                    {/* Description */}
                    <div className="field col-12">
                        <label htmlFor="description">Description</label>
                        <InputTextarea
                            id="description"
                            name="description"
                            value={courseData.description}
                            onChange={handleInputChange}
                            placeholder="Provide a brief course description"
                            rows={5} // Controls the height of the text area
                            cols={30} // Controls the width of the text area
                        />
                        {courseDataError.description && <Message style={{ marginTop: '10px' }} severity="error" text={courseDataError.description} />}
                    </div>

                    {/* Course Photo - Modern Upload */}
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

                {/* Submit Button */}
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
