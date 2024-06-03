import api from "@/OLD/services";

const createProduct = async (data) => await api.post("/products", data);

const createProductGroup = async (data) => await api.post("/kits", data);

const addItemProductGroup = async (data) =>
  await api.post("/kits/add-item", data);

const listProducts = async (filters = {}) =>
  api.get("/products", {
    params: filters
  });

const listProductsGroup = async (filters = {}) =>
  api.get(`/kits`, { params: filters });

const showProduct = async (id, data) =>
  api.get(`/products/${id}`).then((res) => res.data);

const showProductGroup = async (id) => api.get(`/kits/${id}`);

const updateProduct = async (id, data) => api.put(`/products/${id}`, data);

const updateProductGroup = async (id, data) => api.put(`/kits/${id}`, data);

const updateKitItem = async (id, data) => api.put(`/kits/item/${id}`, data);

const updateBusinessUnitProduct = async (id, data) =>
  api.put(`/business-unit-products/${id}`, data);

const removeProduct = async (id) => api.delete(`/products/${id}`);

const removeKit = async (id) => api.delete(`/kits/${id}`);

const removeKitItem = async (id) => api.delete(`/kits/item/${id}`);

export const productService = {
  createProduct,
  listProducts,
  updateProduct,
  removeProduct,
  showProduct,
  updateBusinessUnitProduct,
  createProductGroup,
  addItemProductGroup,
  updateProductGroup,
  updateKitItem,
  listProductsGroup,
  showProductGroup,
  removeKit,
  removeKitItem
};
