import api from "@/OLD/services";

const launchExam = async (data) => await api.post("/patient-exams", data);

const createAttachment = async (id, data) =>
  await api.post(`/patient-exams/attachment/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

const listPatientExams = async (id) =>
  await api.get(`/patient-exams?patient=${id}`);

const showPatientExam = async (id) => await api.get(`/patient-exams/${id}`);

const updatePatientExam = async (id, data) =>
  await api.put(`/patient-exams/${id}`, data);

const removeAttachment = async (patientExamId, attachmentId) =>
  api.delete(`/patient-exams/${patientExamId}/${attachmentId}`);

export const patientExamsService = {
  launchExam,
  createAttachment,
  listPatientExams,
  showPatientExam,
  updatePatientExam,
  removeAttachment,
};
