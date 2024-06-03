import api from "@/OLD/services";

const listBeds = async ({ active, type, name }) =>
  await api.get(
    `/beds${active ? `?active=${active}` : ""}${
      type ? `${active ? "&" : "?"}type=${type}` : ""
    }${name ? `${active || type ? "&" : "?"}name=${name}` : ""}`
  );

const createBed = async (data) => await api.post("/beds", data);

const updateBed = async (id, data) => await api.put(`/beds/${id}`, data);

const removeBed = async (id) => await api.delete(`/beds/${id}`);

export const bedsService = {
  listBeds,
  createBed,
  updateBed,
  removeBed,
};
