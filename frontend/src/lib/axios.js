import axios from "axios";
import { BACKEND_URL } from "../constants/endpoints";

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network Error:", error);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
