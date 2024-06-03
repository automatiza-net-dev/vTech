import api from "@/OLD/services";

// GET
const listUnits = async (type = false) =>
  await api.get(`/units${type ? `?type=${type}` : ""}`);

// POST
const swapUnit = async (data) => await api.post("/auth/swap-unit", data);

const forgotPassword = async (data) =>
  await api.post("/auth/forgot-password", data);

export const unitsService = {
  listUnits,
  swapUnit,
  forgotPassword
};
