// @ts-nocheck
import api from "@/OLD/services";

const create = async (data) =>
  await api.post(`/medical-document-templates`, data);

const update = async (id, data) =>
  await api.put(`/medical-document-templates/${id}`, data);

const remove = async (id) =>
  await api.delete(`/medical-document-templates/${id}`);

const getAll = async ({ title, description } = false) =>
  await api.get(
    `/medical-document-templates${title ? `?title=${title}` : ""}${
      description ? `${title ? "&" : "?"}description=${description}` : ""
    }`
  );

const getById = async (id) =>
  await api.get(`/medical-document-templates/${id}`);

export const recipeServices = {
  create,
  update,
  remove,
  getAll,
  getById
};
