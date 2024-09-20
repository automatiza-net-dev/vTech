import api from "@/OLD/services";

const createExam = async (data) => await api.post("/exams", data);

const listExams = async ({ active, type, description, name }) =>
  await api.get(
    `/exams${active ? `?active=${active}` : ""}${
      description ? `${active ? "&" : "?"}description=${description}` : ""
    }${name ? `${active || description ? "&" : "?"}name=${name}` : ""}${
      type ? `${active || description || name ? "&" : "?"}type=${type}` : ""
    }`
  );

const updateExams = async (id, data) => await api.put(`/exams/${id}`, data);

const removeExam = async (id) => await api.delete(`/exams/${id}`);

const showExam = async (id) => await api.get(`/exams/${id}`);

export const examService = {
  createExam,
  listExams,
  updateExams,
  removeExam,
  showExam,
};
