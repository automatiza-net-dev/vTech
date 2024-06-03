// @ts-nocheck
import api from "@/OLD/services";

const getAll = async ({ title, description } = false) =>
  await api.get(
    `/document-templates${title ? `?title=${title}` : ""}${
      description ? `${title ? "&" : "?"}description=${description}` : ""
    }`
  );

const getById = async (id) => await api.get(`/document-templates/${id}`);

const create = async (data) => await api.post(`/document-templates`, data);

const createWithDoc = async (data) =>
  await api.post(`/document-templates/upload`, data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

const renderPdf = (id) => api.get(`/document-templates/render-pdf/${id}`);

const generatePublicLink = (id) => api.get(`/document-templates/pdf/${id}`);

const update = async (id, data) =>
  await api.put(`/document-templates/${id}`, data);

const updateWithDoc = async (id, data) =>
  await api.put(`/document-templates/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

const remove = async (id) => await api.delete(`/document-templates/${id}`);

export const documentServices = {
  create,
  update,
  remove,
  getAll,
  getById,
  createWithDoc,
  renderPdf,
  generatePublicLink,
  updateWithDoc
};
