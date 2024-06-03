import api from '@/OLD/services'

const listTaxationGroupRules = async (opts = {}) => {
  const { data } = await api.get('/taxation-group-rules', {
    params: opts
  })

  return data
}

const storeTaxationGroupRule = async (data) => {
  const { data: response } = await api.post(`/taxation-group-rules`, data)

  return response
}

const updateTaxationGroupRule = async (id, data) => {
  const { data: response } = await api.put(`/taxation-group-rules/${id}`, data)

  return response
}

const showTaxationGroupRule = async (id) =>
  api.get(`/taxation-group-rules/${id}`).then((res) => res.data)

const deleteTaxationGroupRule = async (id) =>
  api.delete(`/taxation-group-rules/${id}`).then((res) => res.data)

export const taxationGroupRulesService = {
  listTaxationGroupRules,
  deleteTaxationGroupRule,
  updateTaxationGroupRule,
  storeTaxationGroupRule,
  showTaxationGroupRule
}
