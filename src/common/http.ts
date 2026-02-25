import axios from "axios";
import { loaderService } from "@/components/Loader/loaderService";

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://www.happyfurandfeather.com/AptcareDWebService';

const http = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor
http.interceptors.request.use(
  (config) => {
    // Show loader on every request
    loaderService.show();
    
    // Add token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    
    return config;
  },
  (error) => {
    // Hide loader on request error
    loaderService.hide();
    return Promise.reject(error);
  }
);

// Add response interceptor
http.interceptors.response.use(
  (response) => {
    // Hide loader on successful response
    loaderService.hide();
    return response;
  },
  (error) => {
    // Hide loader on error response
    loaderService.hide();
    
    if (error.response && error.response.status === 401) {
      // Clear token on 401
      localStorage.removeItem("token");
      // Use window.location for navigation instead of useRouter
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default http;
