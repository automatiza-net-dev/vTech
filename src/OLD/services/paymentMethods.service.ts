import api from "@/OLD/services";

const createPaymentMethod = async (data) =>
  await api.post(`/payment-methods/create`, data);

const createFlag = async (data) =>
  await api.post(`/payment-methods/create-flag`, data);

const createFee = async (data) =>
  await api.post(`/payment-methods/create-fee`, data);

const getPartial = async () => await api.get(`/payment-methods/partial`);

const getTefFlags = async (type) =>
  await api.get(`/payment-methods/tef-flags?type=${type}`);

const getComplete = async ({
  description,
  tef,
  type,
  cancellation,
  account,
  active
}) =>
  await api.get(
    `/payment-methods/complete${
      description ? `?description=${description}` : ""
    }${tef ? `${description ? "&" : "?"}tef=${tef}` : ""}${
      type ? `${description || tef ? "&" : "?"}type=${type}` : ""
    }${
      cancellation
        ? `${
            description || tef || type ? "&" : "?"
          }cancellation=${cancellation}`
        : ""
    }${
      account
        ? `${
            description || tef || type || cancellation ? "&" : "?"
          }account=${account}`
        : ""
    }${
      active
        ? `${
            description || tef || type || cancellation || account ? "&" : "?"
          }active=${active}`
        : ""
    }`
  );

const removePaymentMethod = async (id) =>
  await api.delete(`/payment-methods/delete/${id}`);

const updatePaymentMethod = async (id, data) =>
  await api.put(`/payment-methods/update/${id}`, data);

const updateFeeFlagInstallments = async (id, data) =>
  await api.put(`/payment-methods/update-flag-installment/${id}`, data);

const getTefFlagsAcquirers = async () =>
  await api.get(`/payment-methods/tef-acquirers`);

const updateFlag = async (id, data) =>
  await api.put(`/payment-methods/update-flag/${id}`, data);

export const paymentMethodsService = {
  createPaymentMethod,
  createFlag,
  createFee,
  getPartial,
  getTefFlags,
  getComplete,
  getTefFlagsAcquirers,
  removePaymentMethod,
  updatePaymentMethod,
  updateFlag,
  updateFeeFlagInstallments
};
