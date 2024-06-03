import api from "@/OLD/services";

const getAllBankings = async ({
  type,
  reconciled,
  account,
  competence,
  document,
  from,
  to
}) =>
  api.get(
    `/bankings${type ? `?type=${type}` : ""}${
      document ? `${type ? "&" : "?"}document=${document}` : ""
    }${
      reconciled
        ? `${type || document ? "&" : "?"}reconciled=${reconciled}`
        : ""
    }${
      account
        ? `${type || document || reconciled ? "&" : "?"}account=${account}`
        : ""
    }${
      competence
        ? `${
            type || document || reconciled || account ? "&" : "?"
          }competence=${competence}`
        : ""
    }${
      from
        ? `${
            type || document || reconciled || account || competence ? "&" : "?"
          }from=${from}&to=${to}`
        : ""
    }`
  );

const createBanking = async (data) => api.post("/bankings/create", data);

const updateBanking = async (id, data) =>
  api.put(`/bankings/update/${id}`, data);

export const bankingService = {
  getAllBankings,
  createBanking,
  updateBanking
};
