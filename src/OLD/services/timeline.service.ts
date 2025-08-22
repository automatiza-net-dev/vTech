// @ts-nocheck
import api from "@/OLD/services";

const getCompleteHospitalizationsTimeline = async (id) =>
  await api.get(`/hospitalizations/patient-timeline/${id}`);

const insertWeight = async (data) => await api.post("/n-timeline/weight", data);

const insertDocument = async (data) =>
  await api.post("/n-timeline/documents", data);

const insertRecipe = async (data) =>
  await api.post("/n-timeline/recipes", data);

const insertPatology = async (data) =>
  await api.post("/n-timeline/pathologies", data);

const insertArquive = async (data) =>
  await api.post("/n-timeline/photos", data);

const insertObservations = async (data) =>
  await api.post("/n-timeline/observations", data);

const insertGlycemia = async (data) =>
  await api.post("/n-timeline/glycemia", data);

const insertPressure = async (data) =>
  await api.post("/n-timeline/pressure", data);

const insertPatientEvaluation = async (data) =>
  await api.post("/n-timeline/evaluation", data);

const generateS3Arquive = async (data) =>
  await api.post("/s3/generate-link", data);

// Update
const updateWeight = async (id, data) =>
  await api.put(`/n-timeline/weight/${id}`, data);

const updateDocuments = async (id, data) =>
  await api.put(`/n-timeline/documents/${id}`, data);

const updateMedicalRecipe = async (id, data) =>
  await api.put(`/n-timeline/recipes/${id}`, data);

const updatePathology = async (id, data) =>
  await api.put(`/n-timeline/pathologies/${id}`, data);

const updateObservation = async (id, data) =>
  await api.put(`/n-timeline/observations/${id}`, data);

const updatePatientEvaluation = async (id, data) =>
  await api.put(`/n-timeline/evaluation/${id}`, data);

const updatePhotos = async (id, data) =>
  await api.put(`/n-timeline/photos/${id}`, data);

// Delete

const removeComplete = async (id) => await api.delete(`/n-timeline/${id}`);

// id corresponde ao campo tag no ato do registro
const listLastUpdates = async (id) => await api.get(`/n-timeline/${id}`);

const listDocuments = async (id) =>
  await api.get(`/n-timeline/documents/${id}`);

const listPatologies = async (id) =>
  await api.get(`n-timeline/pathologies/${id}`);

const listMedicalRecipes = async (id) =>
  await api.get(`/n-timeline/recipes/${id}`);

const listWeight = async (id) => await api.get(`/n-timeline/weight/${id}`);

const listPatientHospitalizationTimeline = async (id) =>
  await api.get(`/hospitalizations/timeline/${id}`);

const removeSinglePhoto = async (id, index, route) =>
  await api.delete(`/n-timeline/${route}/${id}/${index}`);

const removeObservationMedia = async (timelineId, mediaIndex) =>
  await api.delete(`/n-timeline/observations/${timelineId}/${mediaIndex}`);

const removeExamMedia = async (timelineId, mediaIndex) =>
  await api.delete(`/n-timeline/evaluation/${timelineId}/${mediaIndex}`);

export const timelineService = {
  insertWeight,
  insertDocument,
  insertRecipe,
  insertPatology,
  insertArquive,
  insertObservations,
  insertGlycemia,
  insertPressure,
  insertPatientEvaluation,
  generateS3Arquive,
  listLastUpdates,
  listDocuments,
  listPatologies,
  listMedicalRecipes,
  listWeight,
  updateWeight,
  updateDocuments,
  updateMedicalRecipe,
  updatePathology,
  updatePhotos,
  updateObservation,
  listPatientHospitalizationTimeline,
  removeSinglePhoto,
  updatePatientEvaluation,
  removeObservationMedia,
  getCompleteHospitalizationsTimeline,
  removeComplete,
removeExamMedia
};
