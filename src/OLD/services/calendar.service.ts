import api from "@/OLD/services";

//

const getSchedules = async (params) => {
  return await api.get("/schedules", { params });
};

const getSchedulesByPatient = async (patientId) =>
  await api.get(`/schedules?pid=${patientId}`);

const getWorkerSchedulers = async () => {
  return await api.get(`/schedules/with-schedule`);
};

const getWorkerSchedulings = async (params) => {
  return await api.get(`/schedules/user`, { params });
};

const getWeekSchedulings = async (params) =>
  await api.get("/schedules/users-weekly-schedules", { params });

const getReturnablesSchedulings = async (patientId) => {
  return await api.get(`/schedules/returnables/${patientId}`);
};

const getSyncableSchedules = async (params) =>
  await api.get("/opportunities/search-syncable-schedules", { params });

const createAbsence = async (data) => {
  return await api.post("/unavailable-days", data);
};

const getAbsences = async (params) => {
  return (await api.get(`/unavailable-days`, { params })).data;
};

const editAbsence = async (id, data) => {
  return await api.put(`/unavailable-days/${id}`, data);
};

const deleteAbsence = async (id) => {
  return await api.delete(`/unavailable-days/${id}`);
};

const getScheduleRange = async (query = "") => {
  return await api.get(`/schedules/groups/${query}`);
};

const getHomeSchedules = async ({ confirmed, unit, page, per_page }) =>
  await api.get(
    `/schedules/home${confirmed ? `?confirmed=${confirmed}` : ""}${
      unit ? `${confirmed ? "&" : "?"}unit=${unit}` : ""
    }${page ? `${confirmed || unit ? "&" : "?"}page=${page}` : ""}${
      per_page
        ? `${confirmed || unit || page ? "&" : "?"}per_page=${per_page}`
        : ""
    }`
  );

const showSchedule = async (id) => await api.get(`/schedules/${id}`);

const getPatientHistoric = async (id) => {
  return await api.get(`/schedules/historic/${id}`);
};

export const calendarService = {
  getSchedules,
  getWorkerSchedulings,
  getSchedulesByPatient,
  createAbsence,
  getAbsences,
  editAbsence,
  deleteAbsence,
  getWorkerSchedulers,
  getScheduleRange,
  getSyncableSchedules,
  getReturnablesSchedulings,
  getHomeSchedules,
  showSchedule,
  getPatientHistoric,
  getWeekSchedulings,
};
