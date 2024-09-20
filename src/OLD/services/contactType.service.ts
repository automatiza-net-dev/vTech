import api from "@/OLD/services";

const getAll = async () => await api.get("/contact-types");

export const contactTypeService = { getAll };
