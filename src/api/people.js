import axiosClient from "./axiosClient";
export const getAllPeople = async (type) => {
  return axiosClient.get("/people/getbytype", { params: { type } });
};
export const addPeople = async (data) => {
  return axiosClient.post("/people/add", data);
};
export const deletePeople = async (data) => {
  return axiosClient.post("/people/delete", data);
};
export const updatePeople = async (data) => {
  return axiosClient.post("/people/update", data);
};
