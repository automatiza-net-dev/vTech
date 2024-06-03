// @ts-nocheck
import api from "@/OLD/services";

const createScheduleServiceGroup = async (data) => {
  return await api.post("/schedule-service-groups", data);
};

const getSingleScheduleServiceGroup = async (id) => {
  return await api.get(`/schedule-service-groups/${id}`);
};

const deleteSingleScheduleServiceGroup = async (id) => {
  return await api.delete(`/schedule-service-groups/${id}`);
};

const editSingleScheduleServiceGroup = async (id, data) => {
  return await api.put(`/schedule-service-groups/${id}`, data);
};

const getScheduleServiceGroups = async (description = false) => {
  return await api.get(
    `/schedule-service-groups${
      description ? `?description=${description}` : ""
    }`
  );
};

const getScheduleServiceTypes = async ({ description, group } = false) => {
  return await api.get(
    `/schedule-service-types${
      description ? `?description=${description}` : ""
    }${group ? `${description ? "&" : "?"}group=${group}` : ""}`
  );
};

const createScheduleServiceType = async (data) => {
  return await api.post("/schedule-service-types", data);
};

const getSingleScheduleType = async (id) => {
  return await api.get(`/schedule-service-types/${id}`);
};

const deleteScheduleType = async (id) => {
  return await api.delete(`/schedule-service-types/${id}`);
};

const editScheduleType = async (id, data) => {
  return await api.put(`/schedule-service-types/${id}`, data);
};

const createStatus = async (data) => {
  return await api.post("/schedule-statuses", data);
};

const deleteStatus = async (id) => {
  return await api.delete(`/schedule-statuses/${id}`);
};

const getAllStatus = async (description) => {
  return (
    await api.get(
      `/schedule-statuses${description ? `?description=${description}` : ""}`
    )
  ).data;
};

const getSingleStatus = async (id) => {
  return (await api.get(`schedule-statuses/${id}`)).data;
};

const editStatus = async (id, payload) => {
  return await api.put(`schedule-statuses/${id}`, payload);
};

export const scheduleTypeServices = {
  createScheduleServiceGroup,
  getScheduleServiceGroups,
  getSingleScheduleServiceGroup,
  deleteSingleScheduleServiceGroup,
  editSingleScheduleServiceGroup,

  createScheduleServiceType,
  getScheduleServiceTypes,
  getSingleScheduleType,
  deleteScheduleType,
  editScheduleType,

  createStatus,
  deleteStatus,
  getAllStatus,
  getSingleStatus,
  editStatus,
};
