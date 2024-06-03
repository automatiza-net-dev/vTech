import api from '@/OLD/services'

const listSubgroups = async (params) => {
  const { data } = await api.get('/subgroups', { params })

  return data
}

const storeSubgroup = async (data) => {
  const { data: response } = await api.post(`/subgroups`, data)

  return response
}

const updateSubgroup = async (id, data) => {
  const { data: response } = await api.put(`/subgroups/${id}`, data)

  return response
}

const deleteSubgroup = async (id) =>
  api.delete(`/subgroups/${id}`).then((res) => res.data)

export const subgroupsService = {
  listSubgroups,
  deleteSubgroup,
  updateSubgroup,
  storeSubgroup
}
