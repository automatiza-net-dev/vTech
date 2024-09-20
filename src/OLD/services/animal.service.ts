import api from "@/OLD/services";

const getSpecies = async ({ description }) => {
  return (await api.get("/species", { params: { description } })).data;
};

const createSpecie = async (data) => {
  return await api.post("/species", data);
};
const editSpecie = async (data, id) => {
  return await api.put(`/species/${id}`, data);
};
const deleteSpecie = async (id) => {
  return await api.delete(`/species/${id}`);
};

const getRaces = async ({ description, specie }) => {
  return (await api.get("/races", { params: { description, specie } })).data;
};

const createRace = async (data) => {
  return await api.post("/races", data);
};

const deleteRace = async (id) => {
  return await api.delete(`/races/${id}`);
};

const editRace = async (id, data) => {
  return await api.put(`/races/${id}`, data);
};

export const animalServices = {
  getSpecies,
  createSpecie,
  editSpecie,
  deleteSpecie,
  getRaces,
  createRace,
  deleteRace,
  editRace,
};
