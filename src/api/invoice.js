import axiosClient from "./axiosClient";
export const getAllInvoice = async () => {
  return axiosClient.get("/invoice/getall");
};
export const createInvoice = async (data) => {
  return axiosClient.post("/invoice/create", JSON.stringify(data));
};
export const deleteInvoice = async (data) => {
  return axiosClient.post("/invoice/delete", data);
};
export const updateInvoice = async (data) => {
  return axiosClient.post("/invoice/update", JSON.stringify(data));
};
