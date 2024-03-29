import axiosClient from "./axiosClient";
export const getAllExam = async () => {
  return axiosClient.get("/exam/getall");
};
export const addExam = async (data) => {
  return axiosClient.post("/exam/add", data);
};
export const deleteExam = async (data) => {
  return axiosClient.post("/exam/delete", data);
};
export const updateExam = async (data) => {
  return axiosClient.post("/exam/update", data);
};
