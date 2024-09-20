import api from "@/OLD/services";

const getAllPermissions = async () => {
  return api.get("/permissions");
};

const duplicatePermission = async (data) => await api.post("/roles/copy", data);

//ROLES
const getAllRoles = async (params = {}) => {
  return api.get("/roles", { params });
};

const getOneRole = async (id) => {
  return api.get(`/roles/${id}`);
};

const getRoleMetadata = async (id, params) => {
  return api.get(`/roles/metadata/${id}`, { params });
};

const searchInfo = async (params) => await api.get("/roles/search", { params });

const createRole = async (role) => {
  return api.post("/roles", role);
};

const addPermissionToRole = async (data) => {
  return api.post("/roles/add-permissions", data);
};

const manageRolePermissions = async (data) => {
  return api.post("/roles/permissions", data);
};

const editRole = async (id, role) => {
  return api.put(`/roles/${id}`, role);
};

const deleteRole = async (id) => {
  return api.delete(`/roles/${id}`);
};

export const adminService = {
  getAllPermissions,
  searchInfo,
  duplicatePermission,
  createRole,
  editRole,
  getAllRoles,
  getOneRole,
  deleteRole,
  addPermissionToRole,
  getRoleMetadata,
  manageRolePermissions,
};
