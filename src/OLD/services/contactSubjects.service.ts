import api from "@/OLD/services";

const getAll = async () => await api.get("/contact-subjects");

export const contactSubjectService = {
  getAll,
};
