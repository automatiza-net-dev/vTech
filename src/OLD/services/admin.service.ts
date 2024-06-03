import api from "@/OLD/services";

//PERMISSIONS
const createPermission = async (data) => {
  return api.post("/permissions", data);
};

const getAllPermissions = async () => {
  return api.get("/permissions");
};

const getOnePermission = async (id) => {
  return api.get(`permissions/${id}`);
};

const editPermission = async (id, permission) => {
  return api.put(`/permissions/${id}`, permission);
};

const deletePermission = async (id) => {
  return api.delete(`/permissions/${id}`);
};

const duplicatePermission = async (data) => await api.post("/roles/copy", data);

//ROLES
const getAllRoles = async (params = {}) => {
  return api.get("/roles", { params });
};

const getOneRole = async (id) => {
  return api.get(`/roles/${id}`);
};

const getRoleMetadata = async (id) => {
  return api.get(`/roles/metadata/${id}`);
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

const removePermissionOfRole = async (roleId, permissionId) => {
  return api.delete(`roles/${roleId}/${permissionId}`);
};

const authAdmin = async (data) => await api.post("/auth/admin-login", data);

export const adminService = {
  createPermission,
  getAllPermissions,
  getOnePermission,
  searchInfo,
  editPermission,
  deletePermission,
  duplicatePermission,

  createRole,
  editRole,
  getAllRoles,
  getOneRole,
  deleteRole,
  addPermissionToRole,
  removePermissionOfRole,
  getRoleMetadata,
  manageRolePermissions,
  authAdmin
};
