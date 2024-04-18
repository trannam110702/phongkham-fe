import axiosClient from "./axiosClient";
export const getAllExam = async () => {
  return axiosClient.get("/exam/getall");
};
export const addExam = async (data) => {
  return axiosClient.post("/exam/add", JSON.stringify(data));
};
export const createInvoice = async (data) => {
  return axiosClient.post("/invoice/create", JSON.stringify(data));
};
export const deleteExam = async (data) => {
  return axiosClient.post("/exam/delete", data);
};
export const updateExam = async (data) => {
  return axiosClient.post("/exam/update", JSON.stringify(data));
};
