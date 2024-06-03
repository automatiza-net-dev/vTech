import api from '@/OLD/services'

const listVariations = async (filters = {}) => {
  const { data } = await api.get('/variations', {
    params: filters
  })

  return data
}

const showVariation = async (id) => {
  const { data } = await api.get(`/variations/${id}`)

  return data
}

const storeVariation = async (data) => {
  const { data: response } = await api.post(`/variations`, data)

  return response
}

const storeVariationOption = async (data) => {
  const { data: response } = await api.post(`/variation-options`, data)

  return response
}

const deleteVariationOption = async (id) => {
  const { data: response } = await api.delete(`/variation-options/${id}`)

  return response
}

const updateVariation = async (id, data) => {
  const { data: response } = await api.put(`/variations/${id}`, data)

  return response
}

const deleteVariation = async (id) =>
  api.delete(`/variations/${id}`).then((res) => res.data)

export const variationService = {
  listVariations,
  deleteVariation,
  updateVariation,
  storeVariation,
  showVariation,
  storeVariationOption,
  deleteVariationOption
}
