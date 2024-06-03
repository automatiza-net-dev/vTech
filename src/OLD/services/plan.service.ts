// @ts-nocheck
import api from "@/OLD/services";

const listAllPlans = async ({ description, group, parent, type } = false) =>
  await api.get(
    `/account-plans${description ? `?description=${description}` : ""}${
      group ? `${description ? "&" : "?"}group=${group}` : ""
    }${parent ? `${description || group ? "&" : "?"}parent=${parent}` : ""}${
      type ? `${description || group || parent ? "&" : "?"}type=${type}` : ""
    }`
  );

const createAccountPlan = async (data) =>
  await api.post("/account-plans", data);

const updateAccountPlan = async (id, data) =>
  await api.put(`/account-plans/${id}`, data);

const removeAccountPlan = async (id) =>
  await api.delete(`/account-plans/${id}`);

export const planService = {
  listAllPlans,
  createAccountPlan,
  updateAccountPlan,
  removeAccountPlan
};
