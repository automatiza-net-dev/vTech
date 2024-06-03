import api from "@/OLD/services";

// GET
const searchTreatments = async (params) =>
  await api.get("/treatments/search", { params });

const searchCompleteTreatments = async (params) =>
  await api.get("/treatments/search-complete", { params });

const showTreatment = async (id) =>
  await api.get("/treatments/search-complete", { params: { treatment: id } });

const searchDateExecutions = async (params) =>
  await api.get("/treatments/search-date", { params });

const searchNotExecuted = async (params) =>
  await api.get("/treatments/search-not-executed", { params });

// POST
const createExecution = async (data) =>
  await api.post("/treatments/create-execution", data);

const completeExecution = async (data) =>
  await api.post("/treatments/execute-execution", data);

const batchCompleteExecution = async (data) =>
  await api.post("/treatments/batch-execute-execution", data);

const batchCreateExecutions = async (data) =>
  await api.post("/treatments/batch-create-execution", data);

const removeExecution = async (data) =>
  await api.post("/treatments/exclude-treatment-execution", data);

export const treatmentService = {
  searchTreatments,
  searchCompleteTreatments,
  showTreatment,
  searchNotExecuted,
  createExecution,
  completeExecution,
  searchDateExecutions,
  batchCompleteExecution,
  batchCreateExecutions,
  removeExecution
};
