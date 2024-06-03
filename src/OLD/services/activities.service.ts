import api from "@/OLD/services";

// GET
const getAll = async () => await api.get("/activities");

export const activitiesService = {
  getAll
};
