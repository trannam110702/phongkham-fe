import axios from "axios";
const axiosClient = axios.create({
  baseURL: "https://phongkham-be.herokuapp.com/",
  timeout: 20000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});
//https://phongkham-be.herokuapp.com/
export default axiosClient;
