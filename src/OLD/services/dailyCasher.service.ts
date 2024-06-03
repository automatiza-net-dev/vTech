import api from "@/OLD/services";

const listDailyCashiers = async (params = {}) =>
  await api.get(`/daily-cashiers`, {
    params
  });

const dumpDailyCashier = async (id) =>
  await api.get(`/daily-cashiers/dump/${id}`);

const getInfoDailyCasher = async (id) =>
  await api.get(`/daily-cashiers/info/${id}`);

const openDailyCasher = async (data) =>
  await api.post("/daily-cashiers/open", data);

const closeDailyCasher = async (id, data) =>
  await api.post(`/daily-cashiers/close/${id}`, data);

const checkDailyCasher = async (id, data) =>
  await api.post(`/daily-cashiers/check/${id}`, data);

const reopenDailyCasher = async (id, data) =>
  await api.post(`/daily-cashiers/reopen/${id}`, data);

const reviewDailyCasher = async (id, data) =>
  await api.post(`/daily-cashiers/review/${id}`, data);

const expenseDailyCasher = async (id, data) =>
  await api.post(`/daily-cashiers/expense/${id}`, data);

const receiptDailyCasher = async (id, data) =>
  await api.post(`/daily-cashiers/receipt/${id}`, data);

const clearPayments = async (arr) =>
  await api.post("/daily-cashiers/clear-payments", arr);

export const dailyCasherService = {
  listDailyCashiers,
  openDailyCasher,
  closeDailyCasher,
  checkDailyCasher,
  reopenDailyCasher,
  reviewDailyCasher,
  expenseDailyCasher,
  receiptDailyCasher,
  dumpDailyCashier,
  getInfoDailyCasher,
  clearPayments
};
