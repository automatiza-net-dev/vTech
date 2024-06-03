import api from "@/OLD/services";

const create = async (data) => await api.post("/contact-types", data);

const getAll = async () => await api.get("/contact-types");

export const contactTypeService = { create, getAll };
