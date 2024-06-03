import api from "@/OLD/services";

const getUser = async () => {
  return await api.get(`/auth/me`);
};

const getOneUser = async (id) => {
  return await api.get(`/users/${id}`);
};

const getUsers = async () => {
  return await api.get("/users");
};

const updateLoggedUser = async (data) => await api.put(`/users`, data);

const getEconomicGroups = async () => {
  return await api.get(`/economic-groups/user`);
};

const listAvailableChangeUnits = async () =>
  await api.get("/auth/available-swaps");

const checkDocument = async (doc) =>
  await api.get(`/users/check-document/${doc}`);

const addLicence = async () => {
  return await api.post("/licences/additional");
};

const changePassword = async (data) => {
  return await api.post("/users/complete-change-password", data);
};

const resetPassword = async (data) =>
  await api.post("/auth/reset-password", data);

const deleteUser = async (id) => {
  return await api.delete(`/users/${id}`);
};

//WORKING DAY
const createWorkingDay = async (data) => {
  return await api.post("/working-days", data);
};

const getWorkingDays = async ({ user }) => {
  return await api.get(`/working-days${user ? `?user=${user}` : ""}`);
};

const getSingleWorkingDay = async (id) => {
  return await api.get(`/working-days/${id}`);
};

const deleteWorkingDay = async (id) => {
  return await api.delete(`/working-days/${id}`);
};

const editWorkingDay = async (id, data) => {
  return await api.put(`/working-days/${id}`, data);
};


const confirmToken = async (data) =>
  await api.post("/users/confirm-token", data);


const startChangePassword = async () =>
  await api.post("/users/start-change-password");

export const userService = {
  getUser,
  getOneUser,
  getUsers,
  getEconomicGroups,
  listAvailableChangeUnits,
  checkDocument,
  addLicence,
  changePassword,
  resetPassword,
  deleteUser,

  createWorkingDay,
  getWorkingDays,
  getSingleWorkingDay,
  deleteWorkingDay,
  editWorkingDay,
  updateLoggedUser,

  confirmToken,
  startChangePassword
};
