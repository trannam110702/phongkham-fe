import axiosClient from "./axiosClient";
export const login = async (data) => {
  return axiosClient.post("/login/signin", data);
};
