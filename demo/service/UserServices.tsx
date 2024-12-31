import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to handle user signup
export const signupStudentAccount = async (userData: Record<string, any>) => {
  try {
    const response = await axiosInstance.post("/register/student", userData);
    return response.data;
  } catch (error: any) {
    console.log(error)
    throw new Error(error.response.data.message);
  }
};

export const login = async (loginData : Record<string , any> ) =>{
  try {
    const response = await axiosInstance.post("/login", loginData);
    return response.data;
  } catch (error: any) {
    console.log(error)
    throw new Error(error.response.data.message);
  }
  
}


export const signupInstructorAccount = async (
  userData: Record<string, any> 
) => {
  try {
    const response = await axiosInstance.post("/register/instructor", userData);
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};


export const verifyAccount = async (token : string) => {
  try {
    const response = await axiosInstance.get(`/verifyEmail?token=${token}`);
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const forgotPasswordRequest = async (email : string) => {
  try {
    const response = await axiosInstance.get(`/forgot-password-request?email=${email}`);
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const resetPassword = async (token : string , password : string) => {
  try {
    const response = await axiosInstance.post(`/resetPassword?token=${token}&password=${password}`);
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};