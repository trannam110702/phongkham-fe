import axiosClient from "./axiosClient";
export const getAllSchedule = async () => {
  return axiosClient.get("/schedule/getall");
};
export const createSchedule = async (data) => {
  return axiosClient.post("/schedule/add", JSON.stringify(data));
};
export const deleteSchedule = async (data) => {
  return axiosClient.post("/schedule/delete", data);
};
export const toggleSchedule = async (data) => {
  return axiosClient.post("/schedule/update", { code: data.code, status: "scheduled" });
};
