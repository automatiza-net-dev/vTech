import api from "@/OLD/services";

const getAllBanks = async () => await api.get(`/banks`);

export const banksService = {
  getAllBanks,
};
