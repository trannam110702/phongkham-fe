import axiosClient from "./axiosClient";
export const getAllMedicine = async () => {
  return axiosClient.get("/medicine/getall");
};
export const addMedicine = async (data) => {
  return axiosClient.post("/medicine/add", data);
};
export const deleteMedicine = async (data) => {
  return axiosClient.post("/medicine/delete", data);
};
export const updateMedicine = async (data) => {
  return axiosClient.post("/medicine/update", data);
};
