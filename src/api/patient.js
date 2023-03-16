import axiosClient from "./axiosClient";
export const getAllPatient = async () => {
  return axiosClient.get("/patient/getall");
};
export const addPatient = async (data) => {
  return axiosClient.post("/patient/add", data);
};
export const deletePatient = async (data) => {
  return axiosClient.post("/patient/delete", data);
};
export const updatePatient = async (data) => {
  return axiosClient.post("/patient/update", data);
};
