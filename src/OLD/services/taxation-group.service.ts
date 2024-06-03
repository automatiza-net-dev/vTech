import api from '@/OLD/services'

const listTaxationGroups = async (opts = {}) => {
  const { data } = await api.get('/taxation-groups', {
    params: opts
  })

  return data
}

const storeTaxationGroup = async (data) => {
  const { data: response } = await api.post(`/taxation-groups`, data)

  return response
}

const updateTaxationGroup = async (id, data) => {
  const { data: response } = await api.put(`/taxation-groups/${id}`, data)

  return response
}

const deleteTaxationGroup = async (id) =>
  api.delete(`/taxation-groups/${id}`).then((res) => res.data)

export const taxationGroupsService = {
  listTaxationGroups,
  deleteTaxationGroup,
  updateTaxationGroup,
  storeTaxationGroup
}
