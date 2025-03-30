import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://team-11-backend-v1-457986151866.us-central1.run.app",
  withCredentials: true,  
  headers: {
    "Content-Type": "application/json",
  }
});

export default axiosInstance;