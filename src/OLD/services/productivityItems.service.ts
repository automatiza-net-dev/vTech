import api from "@/OLD/services";

const getProductivityItems = async (params) =>
  api.get("/productivity-items/products", { params });

export const productivityItemsService = { getProductivityItems };
