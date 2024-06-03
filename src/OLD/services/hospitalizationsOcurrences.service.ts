import api from "@/OLD/services";

const createOccurrence = async (data) =>
  await api.post("/hospitalization-occurrences", data);

const updateOccurrence = async (id, data) =>
  await api.put(`/hospitalization-occurrences/${id}`, data);

const getAllBaseOccurrences = async () => await api.get("/occurrences");

const getOccurrence = async (id) => await api.get(`/occurrences/${id}`);

export const hospitalizationOccurences = {
  createOccurrence,
  getAllBaseOccurrences,
  updateOccurrence,
  getOccurrence
};
