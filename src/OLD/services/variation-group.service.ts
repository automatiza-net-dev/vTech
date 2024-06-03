import api from "@/OLD/services";

const listVariationGroups = async () => {
  const { data } = await api.get("/variation-groups");

  return data;
};

const showVariationGroup = async (id) => {
  const { data: response } = await api.get(`/variation-groups/${id}`);

  return response;
};

const storeVariationGroup = async (data) => {
  const { data: response } = await api.post(`/variation-groups`, data);

  return response;
};

const updateVariationGroup = async (id, data) => {
  const { data: response } = await api.put(`/variation-groups/${id}`, data);

  return response;
};

const deleteVariationGroup = async (id) =>
  api.delete(`/variation-groups/${id}`).then((res) => res.data);

const assignVariationToGroup = async (data) => {
  const { data: response } = await api.post(`/variation-groups/assign`, data);

  return response;
};

const detachVariationFromGroup = async (group, variation) => {
  const { data: response } = await api.delete(
    `/variation-groups/${group}/${variation}`
  );

  return response;
};

export const variationGroupService = {
  listVariationGroups,
  deleteVariationGroup,
  updateVariationGroup,
  storeVariationGroup,
  showVariationGroup,
  assignVariationToGroup,
  detachVariationFromGroup,
};
