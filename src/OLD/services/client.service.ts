import api from "@/OLD/services";

const listAllClients = async (params) => await api.get(`/client-origins`, { params });

export const clientService = {
  listAllClients,
};
