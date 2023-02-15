import axios from "axios";

const AxiosInstance = axios.create({
  baseURL:
    process.env.BACKEND_URL || "https://react-project-backend.onrender.com/",
  timeout: 1000,
});

export default AxiosInstance;
