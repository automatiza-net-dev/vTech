import api from "@/OLD/services";

const listAllCheckingAccounts = async (params = false) =>
  await api.get(`/checking-accounts`, { params });

const showCheckingAccount = async (id) =>
  await api.get(`/checking-accounts/${id}`);

const removeCheckingAccount = async (id) =>
  await api.delete(`/checking-accounts/${id}`);

const openCheckingAccount = async (data) =>
  api.post(`/checking-accounts/open`, data);

const updateCheckingAccount = async (id, data) =>
  api.put(`/checking-accounts/${id}`, data);

export const checkingAccountService = {
  listAllCheckingAccounts,
  showCheckingAccount,
  removeCheckingAccount,
  openCheckingAccount,
  updateCheckingAccount,
};

//
