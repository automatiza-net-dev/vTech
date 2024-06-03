import api from "@/OLD/services";

const create = async (data) => {
  return await api.post(`/business-units`, data);
};

const createCollaborator = async (data) => {
  return await api.post(`/business-units/create-collaborator`, data);
};

const getClinicById = async (id) => {
  return await api.get(`/business-units/${id}`);
};

const getClinicsByUser = async (params = {}) => {
  return await api.get("/business-units/user", {
    params
  });
};

const getColaborators = async ({ name, document, phone, role }) => {
  return await api.get(
    `/business-units/users${name ? `?name=${name}` : ""}${
      document ? `${name ? "&" : "?"}document=${document}` : ""
    }${phone ? `${name || document ? "&" : "?"}phone=${phone}` : ""}${
      role ? `${name || document || phone ? "&" : "?"}role=${role}` : ""
    }`
  );
};

const getAllEconomicGroupUsers = async (
  id,
  { name, document, phone, role }
) => {
  return await api.get(
    `/economic-groups/${id}/users${name ? `?name=${name}` : ""}${
      document ? `${name ? "&" : "?"}document=${document}` : ""
    }${phone ? `${name || document ? "&" : "?"}phone=${phone}` : ""}${
      role ? `${name || document || phone ? "&" : "?"}role=${role}` : ""
    }`
  );
};

const deleteColaborator = async (id) => {
  return await api.delete(`/business-units/user/${id}`);
};

const upDateClinic = async (id, data) => {
  return await api.put(`/business-units/${id}`, data);
};

const createInvite = async (data) => {
  return await api.post("/invites", data);
};

const deleteInvite = async (id) => {
  return await api.delete(`/invites/${id}`);
};

const getInvites = async (filters, id = false) => {
  return await api.get(`/invites${id ? `/${id}` : ""}`);
};

const acceptInvite = async (data) =>
  await api.post("/invites/accept-invite", data);

const updateInvite = async (id, data) => {
  return await api.put(`/invites/${id}`, data);
};

const resendInvite = async (id) => await api.get(`/invites/${id}`);

const showInvite = async (id) => await api.get(`/invites/${id}`);

const createWorkingDay = async (data) => {
  return await api.post("/working-days", data);
};

const updateWorkingDay = async (data, id) => {
  return await api.put(`/working-days/${id}`, data);
};

const deleteWorkingDay = async (id) => {
  return await api.delete(`/working-days/${id}`);
};

const getCollabById = async (id) => await api.get(`/business-units/user/${id}`);

const updateCollaborator = async (id, data) =>
  await api.put(`/business-units/user/${id}`, data);

const updateUnitCollabRoles = async (data) =>
  await api.put(`/business-units/roles`, data);

export const clinicService = {
  getClinicById,
  create,
  getClinicsByUser,
  upDateClinic,
  createInvite,
  getInvites,
  createWorkingDay,
  updateWorkingDay,
  deleteWorkingDay,
  deleteInvite,
  getColaborators,
  deleteColaborator,
  updateInvite,
  updateCollaborator,
  getCollabById,
  updateUnitCollabRoles,
  resendInvite,
  showInvite,
  acceptInvite,
  getAllEconomicGroupUsers,
  createCollaborator
};
