// constants/apiRoutes.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ROUTES = {
    COURSES: {
        CREATE_COURSE: `${API_BASE_URL}/courses`,
        PUBLISH_COURSE_REQUEST: (courseId: string) => `${API_BASE_URL}/courses/${courseId}/publishRequest`,
        PUBLISH_COURSE: (courseId: string) => `${API_BASE_URL}/courses/${courseId}/publish`,
        GET_ALL_COURSES: `${API_BASE_URL}/courses`,
        GET_ALL_COURSES_FOR_ADMIN: `${API_BASE_URL}/admin/courses`,
        GET_ADMIN_DASHBOARD_INFO: `${API_BASE_URL}/admin/courses/info`,
        GET_INSTRUCTOR_DASHBOARD_INFO: (instructorId: string) => `${API_BASE_URL}/instructor/${instructorId}/courses/info`,
        GET_STUDENT_DASHBOARD_INFO: (studentId: string) => `${API_BASE_URL}/student/${studentId}/courses/info`,
        GET_ENROLLED_COURSES_FRO_STUDENT: (studentId: string) => `${API_BASE_URL}/students/${studentId}/courses`,
        GET_ENROLLED_COURSE_FRO_STUDENT_BY_ID: (studentId: string, courseId: string) => `${API_BASE_URL}/students/${studentId}/courses/${courseId}`,
        GET_INSTRUCTOR_COURSES: (instructorId: string) => `${API_BASE_URL}/instructor/${instructorId}/courses`,
        GET_INSTRUCTOR_COURSE: (instructorId: string, courseId: string) => `${API_BASE_URL}/instructor/${instructorId}/courses/${courseId}`,
        GET_COURSES_FOR_REVIEW: `${API_BASE_URL}/review/courses`,
        GET_COURSE_FOR_REVIEW: (courseId: string) => `${API_BASE_URL}/review/courses/${courseId}`,
        ARCHIVE_COURSE: (courseId: string) => `${API_BASE_URL}/courses/${courseId}/archive`,
        ENROLL_COURSE: (studentId: string, courseId: string) => `${API_BASE_URL}/students/${studentId}/courses/${courseId}/enroll`,
        DELETE_COURSE: (courseId: string) => `${API_BASE_URL}/courses/${courseId}`,
        CHECK_IS_ENROLL: (studentId: string, courseId: string) => `${API_BASE_URL}/students/${studentId}/courses/${courseId}/isEnrolled`,
    },
    CATEGORIES: {
        CREATE_CATEGORY: `${API_BASE_URL}/categories`,
        GET_CATEGORY: `${API_BASE_URL}/categories`,

    },
    SECTIONS: {
        ADD_NEW_SECTION: (course_id: string) => `${API_BASE_URL}/courses/${course_id}/sections`,
        GET_COURSE_SECTION: (course_id: string) => `${API_BASE_URL}/courses/${course_id}/sections`,
    },
    LESSONS: {
        ADD_NEW_LESSON: (sectionId: string) => `${API_BASE_URL}/sections/${sectionId}/lessons`,
        GET_LESSON: (lessonId: string) => `${API_BASE_URL}/lessons/${lessonId}`,
        GET_STUDENT_LESSON: (lessonId: string, studentId: string) => `${API_BASE_URL}/students/${studentId}/lessons/${lessonId}`,

    },
    MEDIA: {
        ADD_FILES: (lesson_id: string) => `${API_BASE_URL}/lessons/${lesson_id}/files`,
        ADD_VIDEO: (lesson_id: string) => `${API_BASE_URL}/lessons/${lesson_id}/video`,
        DELETE_VIDEO: (lesson_id: string) => `${API_BASE_URL}/lessons/${lesson_id}/video`,
        DELETE_FILE: (lesson_id: string, file_id: string) => `${API_BASE_URL}/lessons/${lesson_id}/files/${file_id}`,

    },
    USERS: {
        LOGIN: `${API_BASE_URL}/login`,
        SIGN_UP_STUDENT: `${API_BASE_URL}/register/student`,
        SIGN_UP_INSTRUCTOR: `${API_BASE_URL}/register/instructor`,
        VERIFY_ACCOUNT: (token: string) => `${API_BASE_URL}/verifyEmail?token=${token}`,
        FORGOT_PASSWORD_REQUEST: (email: string) => `${API_BASE_URL}/forgot-password-request?email=${email}`,
        RESET_PASSWORD: (token: string, password: string) => `${API_BASE_URL}/resetPassword?token=${token}&password=${password}`,
        GET_INSTRUCTOR_INFO: (instructorId: string) => `${API_BASE_URL}/instructors/${instructorId}`,
        GET_STUDENT_INFO: (studentId: string) => `${API_BASE_URL}/students/${studentId}`,
        GET_ADMIN_INFO: (adminId: string) => `${API_BASE_URL}/admins/${adminId}`,
        UPDATE_INSTRUCTOR_INFO: (instructorId: string) => `${API_BASE_URL}/instructors/${instructorId}/update`,
        UPDATE_STUDENT_INFO: (studentId: string) => `${API_BASE_URL}/students/${studentId}/update`,
        UPDATE_ADMIN_INFO: (adminId: string) => `${API_BASE_URL}/admins/${adminId}/update`,
    },
};
