// @ts-nocheck
import api from "@/OLD/services";

// fazer

const createVaccine = async (data) => await api.post("/vaccines", data);

const listVaccines = async () => await api.get("/vaccines");

const showVacine = async (id) => await api.get(`/vaccines/${id}`);

const updateVacine = async (id, data) => await api.put(`/vaccines/${id}`, data);

const createVaccineProtocol = async (data) =>
  await api.post("/vaccine-protocols", data);

const listProtocols = async ({ vaccine, specie, name, type }: any) =>
  await api.get(
    `/vaccine-protocols${vaccine ? `?vaccine=${vaccine}` : ""}${
      specie ? `${vaccine ? "&" : "?"}specie=${specie}` : ""
    }${name ? `${vaccine || specie ? "&" : "?"}name=${name}` : ""}${
      type ? `${vaccine || specie || name ? "&" : "?"}type=${type}` : ""
    }`
  );

const updateProtocol = async (id, data) =>
  await api.put(`/vaccine-protocols/${id}`, data);

const launchVaccine = async (data) => await api.post("/patient-vaccines", data);

const listPatientVaccinesLaunched = async ({ patientId, vaccine } = false) =>
  await api.get(
    `/patient-vaccines${patientId ? `?patient=${patientId}` : ""}${
      vaccine ? `${patientId ? "&" : "?"}vaccine=${vaccine}` : ""
    }`
  );

const showPatientVaccine = async (id) =>
  await api.get(`/patient-vaccines/${id}`);

const updateApplicationDate = async (id, data) =>
  api.put(`/vaccine-calendars/${id}`, data);

const getVaccineCalendarData = async ({ schedule }) =>
  await api.get(`/vaccine-calendars${schedule ? `?schedule=${schedule}` : ""}`);

export const vaccinesService = {
  createVaccine,
  createVaccineProtocol,
  listVaccines,
  listProtocols,
  showVacine,
  updateVacine,
  updateProtocol,
  launchVaccine,
  listPatientVaccinesLaunched,
  updateApplicationDate,
  showPatientVaccine,
  getVaccineCalendarData,
};
