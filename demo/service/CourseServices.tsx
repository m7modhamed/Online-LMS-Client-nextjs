import axios from 'axios';
import { Lesson, Section } from '../../app/interfaces/interfaces';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080'
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // or any other storage mechanism (sessionStorage, redux store)
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getCategories = async () => {
    try {
        const response = await axiosInstance.get('/categories');
        return response.data;
    } catch (error: any) {
        console.log(error);
        throw new Error(error.response.data.message);
    }
};

export const createCourse = async (formData: FormData) => {
    try {
        const response = await axiosInstance.post('/courses', formData);

        return response.data;
    } catch (error: any) {
        console.error('Error creating course:', error.response || error);
        throw new Error(error.response?.data?.message || 'An error occurred');
    }
};


export const getInstructorCourse = async (instructorId: Number, courseId: Number) => {
    try {
        const response = await axiosInstance.get(`/instructor/${instructorId}/courses/${courseId}`);
        return response.data;
    } catch (error: any) {
        console.log(error);
        throw new Error(error.response.data.message);
    }
};

export const getInstructorCourses = async (instructorId: Number) => {
    try {
        const response = await axiosInstance.get(`/instructor/${instructorId}/courses`);
        return response.data;
    } catch (error: any) {
        console.log(error);
        throw new Error(error.response.data.message);
    }
};

export const addNewSection = async (course_id: Number, section: Section) => {
    try {
        const response = await axiosInstance.post(`courses/${course_id}/sections`, section);
        return response.data;
    } catch (error: any) {
        console.log(error);
        throw new Error(error.response.data.message);
    }
};

export const getCourseSections = async (course_id: Number) => {
    try {
        const response = await axiosInstance.get(`/courses/${course_id}/sections`);
        return response.data;
    } catch (error: any) {
        console.log(error);
        throw new Error(error.response.data.message);
    }
};

export const addNewLesson = async (sectionId: Number, lesson: Lesson) => {
    try {
        const response = await axiosInstance.post(`sections/${sectionId}/lessons`, lesson);
        return response.data;
    } catch (error: any) {
        console.log(error);
        throw new Error(error.response.data.message);
    }
};

export const addFiles = async (lesson_id: number, formData: FormData) => {
    try {
        const response = await axiosInstance.post(
            `/lessons/${lesson_id}/files`,
            formData, // Send the formData object
            {
                headers: {
                    'Content-Type': 'multipart/form-data' 
                }
            }
        );

        return response.data;
    } catch (error: any) {
        console.log(error);
        throw new Error(error.response?.data?.message || 'Error uploading media');
    }
};

export const addVideo = async (lesson_id: number, formData: FormData) => {
    try {
        const response = await axiosInstance.post(
            `/lessons/${lesson_id}/video`,
            formData, // Send the formData object
            {
                headers: {
                    'Content-Type': 'multipart/form-data' // Tell the backend it's form data
                }
            }
        );

        return response.data;
    } catch (error: any) {
        console.log(error);
        throw new Error(error.response?.data?.message || 'Error uploading media');
    }
};

export const deleteVideo = async (lesson_id: number) => {
    try {
        const response = await axiosInstance.delete(`/lessons/${lesson_id}/video`);

        return response.data;
    } catch (error: any) {
        console.log(error);
        throw new Error(error.response?.data?.message || 'Error uploading media');
    }
};

export const getLesson = async (lessonId: Number) => {
    try {
        const response = await axiosInstance.get(`/lessons/${lessonId}`);
        return response.data;
    } catch (error: any) {
        console.log(error);
        throw new Error(error.response.data.message);
    }
};
