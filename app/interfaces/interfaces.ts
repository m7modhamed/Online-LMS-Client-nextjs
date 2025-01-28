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
  password: string;
  phoneNumber: string;
  confirmPassword: string;
}

export interface ISignupError {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  confirmPassword?: string;
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
  id: Number;
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
  fileResource?: any[],
  video?: any,

}

export interface Content {
  id?: Number,
  url: string
}
export interface Video extends Content {
  duration: Number

}

export interface IUser {
  id: Number,
  firstName: string,
  lastName: string,
  role: string,
  isActive: boolean,
  isBlocked: boolean,
  image: string
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