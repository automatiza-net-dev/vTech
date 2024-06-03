import api from "@/OLD/services";

const listDrugsAdministrations = async () => await api.get("/drug-administrations");

export const drugsAdministrationsService = {
  listDrugsAdministrations,
};
