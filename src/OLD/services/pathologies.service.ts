// @ts-nocheck
import api from "@/OLD/services";

const create = async (data) => await api.post(`/pathologies`, data);

const update = async (id, data) => await api.put(`/pathologies/${id}`, data);

const remove = async (id) => await api.delete(`/pathologies/${id}`);

const getAll = async ({ description } = false) =>
  await api.get(
    `/pathologies${description ? `?description=${description}` : ""}`
  );

const getById = async (id) => await api.get(`/pathologies/${id}`);

export const pathologiesServices = {
  create,
  update,
  remove,
  getAll,
  getById,
};
