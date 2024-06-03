import api from '@/OLD/services'

const createProductVariation = async (data) =>
  api.post(`/product-variations/`, data)

const updateProductVariation = async (id, data) =>
  api.put(`/product-variations/${id}`, data)

export const productVariationsService = {
  createProductVariation,
  updateProductVariation
}
