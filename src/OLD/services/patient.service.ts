// @ts-nocheck
import api from "@/OLD/services";

const getTutors = async (params) => {
  return api.get(`/patient-tutors`, { params });
};

const getSingleTutor = async (id) => {
  return api.get(`/patient-tutors/${id}`);
};

const getPatientsByTutor = async () => {
  return api.get(); //ainda sem endpoint
};

const getTutorOrigins = async (params) => {
  return await api.get(`/client-origins`, { params });
};

const getUniqueOrigins = async (params) => {
  return await api.get(`/patients/unique-origins`, { params });
};

const getPatients = async (params) => {
  return (
    await api.get(`patients/animals`, {
      params
    })
  ).data;
};

const getSinglePatient = async (id) => {
  return api.get(`/patients/${id}`);
};

const checkPhone = async (data) =>
  await api.post("/patients/check-phone", data);

const searchPatient = async (data) => {
  return (
    await api.get(
      `/patients/search?holder=${data.holder}&patient=${data.patient}`,
      data
    )
  ).data;
};

const getPatientMetadata = async (id) => api.get(`/patients/metadata/${id}`);

const getPatientSalesMetadata = async (id) =>
  api.get(`/patients/sales-metadata/${id}`);

const getPatientHairTypes = async () => await api.get("/patient-animal-hairs");

const getTutorProfessions = async () => await api.get("/professions");

const assignPatientToTutor = async (data) => {
  return await api.post("patient-tutors/assign", data);
};

const createTutor = async (data) => {
  return api.post("patient-tutors", data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

const createPatient = async (data) => {
  return api.post("/patients", data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

const fastPatientRegister = async (data) =>
  await api.post("/patients/fast", data);

const editPatient = async (data, id) => {
  return api.put(`/patients/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

const editTutor = async (data, id) => {
  return api.put(`/patient-tutors/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

const setMainTutor = async (patientId, tutorId) =>
  await api.put(`/patients/main/${patientId}/${tutorId}`);

const deletePatient = async (id) => {
  return api.delete(`/patients/${id}`);
};

export const petsService = {
  getTutors,
  getSingleTutor,
  getPatientsByTutor,
  getTutorProfessions,
  getUniqueOrigins,

  createTutor,
  editTutor,
  assignPatientToTutor,

  getPatients,
  createPatient,
  editPatient,
  getSinglePatient,
  deletePatient,

  searchPatient,
  getTutorOrigins,
  checkPhone,
  setMainTutor,
  fastPatientRegister,
  getPatientMetadata,
  getPatientSalesMetadata,
  getPatientHairTypes
};
