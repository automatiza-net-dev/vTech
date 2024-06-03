// @ts-nocheck
import api from "@/OLD/services";

const index = async ({ name, type } = false) =>
  await api.get(
    `/account-plan-groups${name ? `?name=${name}` : ""}${
      type ? `${name ? "&" : "?"}type=${type}` : ""
    }`
  );

const show = async (id) => await api.get(`/account-plan-groups/${id}`);

const create = async (data) => await api.post("/account-plan-groups", data);

const update = async (id, data) =>
  await api.put(`/account-plan-groups/${id}`, data);

const remove = async (id) => await api.delete(`/account-plan-groups/${id}`);

export const plansGroupService = {
  index,
  show,
  create,
  update,
  remove
};
