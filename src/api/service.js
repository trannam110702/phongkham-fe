import axiosClient from "./axiosClient";
export const getAllService = async () => {
  return axiosClient.get("/service/getall");
};
export const addService = async (data) => {
  return axiosClient.post("/service/add", data);
};
export const deleteService = async (data) => {
  return axiosClient.post("/service/delete", data);
};
export const updateService = async (data) => {
  return axiosClient.post("/service/update", data);
};
