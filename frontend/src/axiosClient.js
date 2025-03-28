import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://team-11-backend-v1-457986151866.us-central1.run.app", 
  withCredentials: true, //     Allows sending cookies (HTTP-only)
  headers: {
    "Content-Type": "application/json" // Explicitly set JSON content type
  }
});

// Request Interceptor: Logs outgoing requests
// axiosInstance.interceptors.request.use(
//   (config) => {
//     console.log(`Sending request to: ${config.url}`);
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

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
