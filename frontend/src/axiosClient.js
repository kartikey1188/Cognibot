import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://team-11-backend-v1-457986151866.us-central1.run.app", 
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json" 
  }
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handles unauthorized (401) responses
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401 & window.location.href != "/login")  {
//       console.error("Unauthorized! Redirecting to login...");
//       window.location.href = "/login"; // Redirect to login page
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
