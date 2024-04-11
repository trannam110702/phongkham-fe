import axios from "axios";
import { message } from "antd";
const axiosClient = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
