import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: process.env.BACKEND_URL || "",
  timeout: 1000,
});

export default AxiosInstance;
