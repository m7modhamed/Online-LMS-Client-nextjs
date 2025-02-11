import { boolean } from "yup";

// Define Instructor type
export interface Instructor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: Image;
  phoneNumber: string;
  specialization: string;
  aboutMe: string;
  linkedinUrl: string;
  githubUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  createdAt: [number, number, number, number, number, number, number];
  lastUpdated: [number, number, number, number, number, number, number];
}

export interface IBusinessSignUp {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phoneNumber: string;
  specialization: string;
  aboutMe: string;
  linkedinUrl: string;
  githubUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  profileImage?: Image;

}
export interface IBusinessSignUpError {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  specialization?: string;
  aboutMe?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  confirmPassword?: string;
  profileImage?: string;
}

// Define Category type
export interface Category {
  id: number;
  name: string;
  description: string;
}


export interface ISignup {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber: string;
  confirmPassword?: string;
  profileImage?: Image;

}

export interface ISignupError {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  confirmPassword?: string;
  profileImage?: string;

}

export interface ILogin {
  email: string;
  password: string;
}


export interface ILoginError {
  email?: '';
  password?: '';
}

// Define Course type
export interface Course {
  id: number;
  name: string;
  status: string;
  description: string;
  language: string;
  prerequisites: string[];
  sections: Section[];
  category: Category;
  instructor: Instructor;
  createdAt: string;
  lastUpdate: string;
  enrolledStudentsNumber: Number;
  coverImage: Image;
  duration: Number

}

export interface Image {
  id?: Number;
  name: string;
  type: string;
  imageUrl: string;
}

export interface Section {
  id?: Number
  title: string,
  description: string,
  position: Number,
  lessons?: Lesson[],
}

export interface Lesson {
  id?: Number,
  title: string,
  position: Number,
  fileResource?: IFile[],
  video?: any,

}

export interface Content {
  id?: Number,
  url: string
}
export interface Video extends Content {
  duration: Number

}

export interface IFile extends Content {
  name: string,
  type: string,
}

export interface IUser {
  id: Number,
  firstName: string,
  lastName: string,
  role: string,
  isActive: boolean,
  isBlocked: boolean,
  image: string,
  exp: any
}

export interface IDashboardInfo {
  coursesCount: string,
  lastWeekCoursesCount: string,
  reviewCoursesCount: string,
  publishCoursesCount: string,
  draftCoursesCount: string,
  archivedCoursesCount: string,
  deletedCoursesCount: string
}

export interface paginationResponse {
  content : Course[],
  pageable: {
    pageNumber: number,
    pageSize: number,
    sort: {
      empty: boolean,
      sorted: boolean,
      unsorted: boolean
    },
    offset: number,
    paged: boolean,
    unpaged: boolean
  },
  last: boolean,
  totalElements: number,
  totalPages: number,
  size: number,
  number: number,
  sort: {
    empty: boolean,
    sorted: boolean,
    unsorted: boolean
  },
  first: boolean,
  numberOfElements: number,
  empty: boolean
}