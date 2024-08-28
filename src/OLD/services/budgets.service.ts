import api from "@/OLD/services";

// POST
const createBudget = async (data) => {
  const { data: budget } = await api.post(`/budgets/create`, data);

  return budget;
};

const createBudgetItem = async (data) =>
  await api.post(`/budgets/create-item`, data);

const createMultipleBudgetItems = async (data) =>
  await api.post("/budgets/create-items", data);

// PUT
const updateBudgetItem = async (data) =>
  await api.put(`/budgets/update-items`, data);

const cancelBudget = async (id, data) =>
  await api.put(`/budgets/cancel/${id}`, data);

const confirmBudget = async (id, data) => {
  const { data: budget } = await api.put(`/budgets/confirm/${id}`, data);

  return budget;
};

const createBudgetPayments = async (data) =>
  await api.post("/budgets/create-payments", data);

const updateObservation = async (id, data) =>
  await api.put(`/budgets/update-observation/${id}`, data);

const updateBudgetSellerAndReviewer = async (id, data) =>
  await api.put(`/budgets/update/${id}`, data);

const removeBudgetPayment = async (data) =>
  await api.put("/budgets/exclude-payment", data);

// GET
const getCompleteBudgets = async (params) => {
  const { data } = await api.get(`/budgets/complete`, { params });

  return data ?? [];
};

const getPartialBudgets = async (params) => {
  const { data } = await api.get(`/budgets/partial`, { params });

  return data ?? [];
};

const getBudgetProducts = async (params) => {
  const { data } = await api.get(`/budgets/products`, { params });

  return data ?? [];
};

const getCompleteBudget = async (id) => {
  const { data } = await api.get(`/budgets/${id}`);

  return data ?? [];
};

const getBudgetsFromAttendance = async (id) =>
  await api.get(`/budgets/from-attendance/${id}`);

const getBudgetPayments = async (id) =>
  await api.get(`/budgets/payments/${id}`);

// DELETE
const removeBudgetItem = async (id) =>
  await api.delete(`/budgets/delete-item/${id}`);

export const budgetService = {
  createBudget,
  createBudgetItem,
  createMultipleBudgetItems,
  createBudgetPayments,

  updateBudgetItem,
  cancelBudget,
  confirmBudget,
  updateObservation,
  updateBudgetSellerAndReviewer,
  removeBudgetPayment,

  getCompleteBudgets,
  getPartialBudgets,
  getBudgetProducts,
  getCompleteBudget,
  getBudgetsFromAttendance,
  getBudgetPayments,

  removeBudgetItem
};
