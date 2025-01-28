// import axios from 'axios';
// import { Lesson, Section } from '../../app/interfaces/interfaces';
// import { getSession } from 'next-auth/react';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/lib/nextAuth';

// const axiosInstance = axios.create({
//     baseURL: 'http://localhost:8080'
// });

// const setAuthHeader = async () => {
//     const isServer = typeof window === 'undefined';
//     let session;
//     if (isServer) {
//         session = await getServerSession(authOptions);

//     } else {
//         session = await getSession();
//     }
//     if (session?.accessToken) {
//         return { Authorization: `Bearer ${session.accessToken}` };
//     }
//     return {};
// };

// // Axios request interceptor
// axiosInstance.interceptors.request.use(
//     async (config) => {
//         const authHeader = await setAuthHeader(); // Get the Authorization header dynamically
//         config.headers = {
//             ...config.headers,
//             ...authHeader // Add Authorization header to request headers
//         };
//         return config; // Proceed with the request
//     },
//     (error) => {
//         return Promise.reject(error); // Reject in case of error
//     }
// );
// export const getCategories = async () => {
//     try {
//         const response = await axiosInstance.get('/categories');
//         return response.data;
//     } catch (error: any) {
//         throw new Error(error.response.data.message);
//     }
// };

// export const createCourse = async (formData: FormData) => {
//     try {
//         const response = await axiosInstance.post('/courses', formData);

//         return response.data;
//     } catch (error: any) {
//         console.error('Error creating course:', error.response || error);
//         throw new Error(error.response?.data?.message || 'An error occurred');
//     }
// };
// export const getEnrolledStudentCourse = async (studentId: Number, courseId: Number) => {
//     try {
//         const response = await axiosInstance.get(`/students/${studentId}/courses/${courseId}`);
//         return response.data;
//     } catch (error: any) {
//         console.log(error);
//         throw new Error(error.response.data);
//     }
// };

// export const getEnrolledStudentCourses = async (studentId: Number) => {
//     try {
//         const response = await axiosInstance.get(`/students/${studentId}/courses`);
//         return response.data;
//     } catch (error: any) {
//         console.log(error);
//         throw new Error(error.response.data);
//     }
// };

// export const getStudentCourse = async (courseId: Number) => {
//     try {
//         const response = await axiosInstance.get(`/courses/${courseId}`);
//         return response.data;
//     } catch (error: any) {
//         console.log(error);
//         throw new Error(error.response.data);
//     }
// };
// export const getInstructorCourse = async (instructorId: Number, courseId: Number) => {
//     try {
//         const response = await axiosInstance.get(`/instructor/${instructorId}/courses/${courseId}`);
//         return response.data;
//     } catch (error: any) {
//         console.log(error);
//         throw new Error(error.response.data.message);
//     }
// };


// export const getInstructorCourses = async (instructorId: Number) => {
//     try {
//         const response = await axiosInstance.get(`/instructor/${instructorId}/courses`);
//         return response.data;
//     } catch (error: any) {
//         console.log(error);
//         //throw new Error(error.response.data.message);
//     }
// };

// export const addNewSection = async (course_id: Number, section: Section) => {
//     try {
//         const response = await axiosInstance.post(`courses/${course_id}/sections`, section);
//         return response.data;
//     } catch (error: any) {
//         console.log(error);
//         throw new Error(error.response.data.message);
//     }
// };

// export const getCourseSections = async (course_id: Number) => {
//     try {
//         const response = await axiosInstance.get(`/courses/${course_id}/sections`);
//         return response.data;
//     } catch (error: any) {
//         console.log(error);
//         throw new Error(error.response.data.message);
//     }
// };

// export const addNewLesson = async (sectionId: Number, lesson: Lesson) => {
//     try {
//         const response = await axiosInstance.post(`sections/${sectionId}/lessons`, lesson);
//         return response.data;
//     } catch (error: any) {
//         console.log(error);
//         throw new Error(error.response.data.message);
//     }
// };

// export const addFiles = async (lesson_id: number, formData: FormData) => {
//     try {
//         const response = await axiosInstance.post(
//             `/lessons/${lesson_id}/files`,
//             formData, // Send the formData object
//             {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             }
//         );

//         return response.data;
//     } catch (error: any) {
//         console.log(error);
//         throw new Error(error.response?.data?.message || 'Error uploading media');
//     }
// };

// export const addVideo = async (lesson_id: number, formData: FormData) => {
//     try {
//         const response = await axiosInstance.post(
//             `/lessons/${lesson_id}/video`,
//             formData, // Send the formData object
//             {
//                 headers: {
//                     'Content-Type': 'multipart/form-data' // Tell the backend it's form data
//                 }
//             }
//         );

//         return response.data;
//     } catch (error: any) {
//         console.log(error);
//         throw new Error(error.response?.data?.message || 'Error uploading media');
//     }
// };

// export const deleteVideo = async (lesson_id: number) => {
//     try {
//         const response = await axiosInstance.delete(`/lessons/${lesson_id}/video`);

//         return response.data;
//     } catch (error: any) {
//         console.log(error);
//         throw new Error(error.response?.data?.message || 'Error uploading media');
//     }
// };

// export const deleteFile = async (lesson_id: number, file_id: number) => {
//     try {
//         const response = await axiosInstance.delete(`/lessons/${lesson_id}/files/${file_id}`);

//         return response.data;
//     } catch (error: any) {
//         console.log(error);
//         throw new Error(error.response?.data?.message || 'Error uploading media');
//     }
// };

// export const getLesson = async (lessonId: Number) => {
//     try {
//         const response = await axiosInstance.get(`/lessons/${lessonId}`);
//         return response.data;
//     } catch (error: any) {
//         console.log(error);
//         throw new Error(error.response.data.message);
//     }
// };
// export const getStudentLesson = async (studentId: Number, lessonId: Number) => {
//     try {
//         const response = await axiosInstance.get(`/students/${studentId}/lessons/${lessonId}`);
//         return response.data;
//     } catch (error: any) {
//         console.log(error);
//         throw new Error(error.response.data.message);
//     }
// };

// export const publishRequest = async (courseId: Number) => {
//     try {
//         const response = await axiosInstance.get(`courses/${courseId}/publishRequest`);
//         return response.data;
//     } catch (error: any) {
//         console.log(error);
//         throw new Error(error.response.data.message);
//     }
// };

// export const archiveCourse = async (courseId: Number) => {
//     try {
//         const response = await axiosInstance.get(`courses/${courseId}/archive`);
//         return response.data;
//     } catch (error: any) {
//         console.log(error);
//         throw new Error(error.response.data.message);
//     }
// };

// export const deleteCourse = async (courseId: Number) => {
//     try {
//         const response = await axiosInstance.delete(`courses/${courseId}`);
//         return response.data;
//     } catch (error: any) {
//         console.log(error);
//         throw new Error(error.response.data.message);
//     }
// };

// export const getCourses = async () => {
//     try {
//         const response = await axios.get(`http://localhost:8080/courses`);
//         console.log('api response : ', response);
//         return response.data;
//     } catch (error: any) {
//         console.error('API Error:', error); // Debug log
//         throw new Error(error.response.data.message);
//     }
// };


// export const getAdminCourses = async () => {
//     try {
//         const response = await axiosInstance.get(`admin/courses`);
//         console.log('api response : ', response);
//         return response.data;
//     } catch (error: any) {
//         console.error('API Error:', error); // Debug log
//         throw new Error(error.response.data.message);
//     }
// };

// export const getAdminCoursesForReview = async () => {
//     try {
//         const response = await axiosInstance.get(`/review/courses`);
//         console.log('api response : ', response);
//         return response.data;
//     } catch (error: any) {
//         console.error('API Error:', error); // Debug log
//         throw new Error(error.response.data.message);
//     }
// };

// export const getAdminCourse = async (courseId: string) => {
//     try {
//         const response = await axiosInstance.get(`/review/courses/${courseId}`);
//         console.log('api response : ', response);
//         return response.data;
//     } catch (error: any) {
//         console.error('API Error:', error); // Debug log
//         throw new Error(error.response.data.message);
//     }
// };


// export const ApprovePublishRequest = async (courseId: Number) => {
//     try {
//         const response = await axiosInstance.get(`courses/${courseId}/publish`);
//         return response.data;
//     } catch (error: any) {
//         console.log(error);
//         throw new Error(error.response.data.message);
//     }
// };
// export const enrollCourse = async (courseId: Number, studentId: Number) => {
//     try {
//         const response = await axiosInstance.post(`/students/${studentId}/courses/${courseId}/enroll`);
//         return response.data;
//     } catch (error: any) {
//         console.log(error);
//         throw new Error(error.response.data.message);
//     }
// };
// export const isStudentEnrolled = async (courseId: Number, studentId: Number) => {
//     try {
//         const response = await axiosInstance.get(`/students/${studentId}/courses/${courseId}/isEnrolled`);
//         return response.data;
//     } catch (error: any) {
//         console.log(error);
//         throw new Error(error.response.data);
//     }
// };
// export const getAdminDashboardInfo = async () => {
//     try {
//         const response = await axiosInstance.get(`/admin/courses/info`);
//         return response.data;
//     } catch (error: any) {
//         console.log(error);
//         throw new Error(error.response.data);
//     }
// };
// export const getInstructorsDashboardInfo = async (instructorId: Number) => {
//     try {
//         const response = await axiosInstance.get(`/instructor/${instructorId}/courses/info`);
//         return response.data;
//     } catch (error: any) {
//         console.log(error);
//         throw new Error(error.response.data);
//     }
// };


