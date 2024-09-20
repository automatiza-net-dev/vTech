import api from "@/OLD/services";

const createBusinessUnitProduct = async (data) =>
  api.post(`/business-unit-products`, data);

export const businessUnitsService = {
  createBusinessUnitProduct,
};
