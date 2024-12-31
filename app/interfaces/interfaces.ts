// Define Instructor type
export interface Instructor {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string | null;
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
  
  // Define Course type
  export interface Course {
    id: number;
    name: string;
    status : string;
    description: string;
    language: string;
    prerequisites: string[];
    sections: Section[];
    category: Category;
    instructor: Instructor;
    createdAt: string;
    lastUpdate: string;
    enrolledStudentsNumber : Number;
    coverImage : Image;
    totalHour : Number;
    totalMinute : Number;
  }

  export interface Image{
     id : Number;
      name : string;
      type : string;
      imageUrl : string;
  }

  export interface Section{
    id : Number
    title: string,
    description: string,
    position : Number,
    lessons : Lesson[],
  }
  

  export interface Lesson{
    id? : Number,
    title: string,
    position : Number,
    fileResource : any[],
    video : any,

  }