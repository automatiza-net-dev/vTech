import api from "@/OLD/services";

const listTaxOperations = async (opts = {}) => {
  const { data } = await api.get("/tax-operations", {
    params: opts,
  });

  return data;
};

const storeTaxOperation = async (data) => {
  const { data: response } = await api.post(`/tax-operations`, data);

  return response;
};

const updateTaxOperations = async (id, data) => {
  const { data: response } = await api.put(`/tax-operations/${id}`, data);

  return response;
};

const deleteTaxOperations = async (id) =>
  api.delete(`/tax-operations/${id}`).then((res) => res.data);

const mapLabel = (value) => {
  if (value === "NOTA_ENTRADA") return "Nota de Entrada";
  if (value === "DEVOLUCAO_ENTRADA") return "Devolução de Entrada";
  if (value === "TRANSFERENCIA_ENTRADA") return "Transferência de Entrada";
  if (value === "OUTROS_ENTRADAS") return "Outras Entradas";

  if (value === "NOTA_SAIDA") return "Nota de Saída";
  if (value === "DEVOLUCAO_SAIDA") return "Devolução de Saída";
  if (value === "TRANSFERENCIA_SAIDA") return "Transferência de Saída";
  if (value === "OUTROS_SAIDAS") return "Outras Saídas";

  return null;
};

export const taxOperationService = {
  listTaxOperations,
  deleteTaxOperations,
  updateTaxOperations,
  storeTaxOperation,
  mapLabel,
};
