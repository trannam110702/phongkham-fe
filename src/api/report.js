import axiosClient from "./axiosClient";
export const getReport = async (params) => {
  return axiosClient.get("/report/revenue", { params });
};

export const getServiceReport = async (params) => {
  return axiosClient.get("/report/serviceQuantity", { params });
};
