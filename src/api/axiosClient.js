import axios from "axios";
const axiosClient = axios.create({
  baseURL: "http://localhost:4001",
  timeout: 20000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});
//https://phongkham-be.onrender.com
//http://localhost:4001
export default axiosClient;
