// @ts-nocheck
import api from "@/OLD/services";

const listAllMovements = async ({ from, to } = false) =>
  await api.get(
    `/daily-movements${from && to ? `?from=${from}&to=${to}` : ""}`
  );

const dailyMovementsSearch = async (params) =>
  await api.get("/daily-movements/search", { params });

const openDailyMovement = async (data) =>
  await api.post("/daily-movements/open", data);

const closeDailyMovement = async (id, data) =>
  await api.post(`/daily-movements/close/${id}`, data);

const checkDailyMovement = async (id, data) =>
  await api.post(`/daily-movements/check/${id}`, data);

const reopenDailyMovement = async (id, data = {}) =>
  await api.post(`/daily-movements/reopen/${id}`, data);

export const dailyMovementsService = {
  listAllMovements,
  dailyMovementsSearch,
  openDailyMovement,
  closeDailyMovement,
  checkDailyMovement,
  reopenDailyMovement
};
