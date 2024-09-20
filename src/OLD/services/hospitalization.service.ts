import api from "@/OLD/services";


const listHospitalizations = async (filters = false) =>
  await api.get("/hospitalizations");

const hospitalizationInfo = async (id) =>
  await api.get(`/hospitalizations/info/${id}`);

const getParsedHospitalizations = async (params) =>
  await api.get("/hospitalizations/parsed-index", { params });

const listCompleteHospitalizations = async (params) =>
  api.get("/hospitalizations/completed", { params });

const createHospitalization = async (data) =>
  await api.post("/hospitalizations", data);

const finalizeHospitalization = async (id) =>
  await api.put(`/hospitalizations/complete/${id}`);

export const hospitalizationService = {
  createHospitalization,
  listHospitalizations,
  finalizeHospitalization,
  hospitalizationInfo,
  getParsedHospitalizations,
  listCompleteHospitalizations
};
