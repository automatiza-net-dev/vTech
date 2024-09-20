import api from "@/OLD/services";

const getAll = async () => await api.get("/crm-status");

export const crmStatusService = {
  getAll,
};
