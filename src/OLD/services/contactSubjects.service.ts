import api from "@/OLD/services";

const create = async (data) => await api.post("/contact-subjects", data);

const getAll = async () => await api.get("/contact-subjects");

export const contactSubjectService = {
  create,
  getAll
};
