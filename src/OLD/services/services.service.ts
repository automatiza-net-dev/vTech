// @ts-nocheck
import api from "@/OLD/services";

const getAllServices = async (
  { description, active, subgroup, taxation } = false
) =>
  await api.get(
    `/services${description ? `?description=${description}` : ""}${
      subgroup ? `${description ? "&" : "?"}subgroup=${subgroup}` : ""
    }${
      taxation
        ? `${description || subgroup ? "&" : "?"}taxation=${taxation}`
        : ""
    }${
      active
        ? `${description || subgroup || taxation ? "&" : "?"}active=${active}`
        : ""
    }`
  );

const showService = async (id) => await api.get(`/@/OLD/services/${id}`);

const createService = async (data) => await api.post("/services", data);

const updateService = async (id, data) =>
  await api.put(`/@/OLD/services/${id}`, data);

const removeService = async (id) => await api.delete(`/@/OLD/services/${id}`);

export const servicesService = {
  getAllServices,
  showService,
  createService,
  updateService,
  removeService,
};
