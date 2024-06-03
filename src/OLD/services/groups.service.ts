import api from "@/OLD/services";

const listSubgroups = async () => await api.get("/subgroups");

export const groupsService = {
  listSubgroups,
};
