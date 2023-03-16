import axiosClient from "./axiosClient";
export const getAllMedico = async () => {
  return axiosClient.get("/medico/getall");
};
export const addMedico = async (data) => {
  return axiosClient.post("/medico/add", data);
};
export const deleteMedico = async (data) => {
  return axiosClient.post("/medico/delete", data);
};
export const updateMedico = async (data) => {
  return axiosClient.post("/medico/update", data);
};
