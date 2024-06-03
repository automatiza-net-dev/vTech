import api from "@/OLD/services";

const create = async (data) => await api.post("/crm-status", data);

const getAll = async () => await api.get("/crm-status");

export const crmStatusService = {
  create,
  getAll
};
