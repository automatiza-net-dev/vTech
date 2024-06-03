import api from "@/OLD/services";

// GET
const getAll = async () => await api.get("/metas");

const create = async (data) => await api.post("/metas", data);

const updateMeta = async (id, data) => await api.put(`/metas/${id}`, data);

const deleteMeta = async (id) => await api.delete(`/metas/${id}`);

export const metasService = {
  getAll,
  create,
  updateMeta,
  deleteMeta
};
