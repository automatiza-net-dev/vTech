import api from "@/OLD/services";

// GET

const getAll = async (params) =>
  await api.get(`/opportunities/search`, { params });

const getAllKanban = async (params) =>
  await api.get("/opportunities/search-kanban", { params });

const showOpportunity = async (id) =>
  await api.get(`/opportunities/show/${id}`);

const getAllActivities = async (params) =>
  await api.get("/opportunities/search-activities", { params });

const getSyncableOpportunities = async (params) =>
  await api.get("/opportunities/search-syncable-opportunities", { params });

// POST
const create = async (data) => await api.post("/opportunities", data);

const createActivity = async (data) =>
  await api.post("/opportunities/create-activity", data);

const updateActivityOpportunity = async (data) =>
  await api.post("/opportunities/update-activity", data);

const executeActivity = async (id, data) =>
  await api.post(`/opportunities/execute-activity/${id}`, data);

const closeWinning = async (id, data) =>
  await api.post(`/opportunities/close-winning/${id}`, data);

const closeLossing = async (id, data) =>
  api.post(`/opportunities/close-losing/${id}`, data);

const updateUser = async (id, data) =>
  api.post(`/opportunities/update-user/${id}`, data);

const updateStatus = async (id, data) =>
  api.post(`/opportunities/update-status/${id}`, data);

const excludeActivityOpportunity = async (id) =>
  api.post(`/opportunities/exclude-activity/${id}`);

const syncSchedule = async (data) =>
  await api.post("/opportunities/sync-schedule", data);

const reopenActivity = async (id) =>
  await api.post(`/opportunities/reopen-activity/${id}`);

const reopenOpportunity = async (id) =>
  await api.post(`/opportunities/reopen/${id}`);

// PUT
const update = async (id, data) => await api.put(`/opportunities/${id}`, data);

const updateActivity = async (id, data) =>
  await api.put(`/activities/${id}`, data);

// DELETE
const removeOpportunity = async (id) =>
  await api.delete(`/opportunities/${id}`);

export const opportunitiesService = {
  getAll,
  getAllKanban,
  create,
  createActivity,
  reopenActivity,
  update,
  showOpportunity,
  updateActivity,
  updateActivityOpportunity,
  executeActivity,
  getAllActivities,
  getSyncableOpportunities,
  closeWinning,
  closeLossing,
  updateUser,
  updateStatus,
  syncSchedule,
  excludeActivityOpportunity,
  removeOpportunity,
  reopenOpportunity,
};
