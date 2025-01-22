import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/nextAuth";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080'
});

const useAxiosInterceptor =async () => {
    const { accessToken } = await getServerSession(authOptions);
    console.log('ss' , accessToken)
    // Interceptor that attaches the Authorization header if session.token is available
    axiosInstance.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  
    return axiosInstance;
  };

  export default useAxiosInterceptor;