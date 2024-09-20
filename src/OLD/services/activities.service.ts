import api from "@/OLD/services";

const getAll = async () => await api.get("/activities");

export const activitiesService = {
  getAll,
};
