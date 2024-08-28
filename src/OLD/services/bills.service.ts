import api from "@/OLD/services";

// GET
const getAllBills = async (params) => {
  const { data } = await api.get(`/bills`, { params });

  return data;
};

const getSingleBill = async (id) => {
  const { data } = await api.get(`/bills/show/${id}`);

  return data;
};

const getBillProducts = async () => {
  const { data } = await api.get("/bills/products");

  return data;
};

const getFiscalData = async (params) =>
  await api.get("/fiscal-documents/business-unit/issued-nfe", { params });

// POST
const createBill = async (formData) => {
  const { data } = await api.post(`/bills/create`, formData);

  return data;
};

const createBillItem = async (formData) => {
  const { data } = await api.post(`/bills/create-item`, formData);

  return data;
};

const createMultipleItems = async (formData) => {
  const { data } = await api.post("/bills/create-items", formData);
};

const createBillPayment = async (formData) => {
  const { data } = await api.post(`/bills/create-payment`, formData);

  return data;
};

const convertBillToTreatment = async (form) => {
  const { data } = await api.post("/bills/create-treatment", form);

  return data;
};

const verifyDiscount = async (data) =>
  await api.post("/bills/check-item-discount", data);

// DELETE
const removeBillPaymentBlock = async (data) =>
  await api.delete("/bills/delete-payment-block", { data });

const removeBillPayment = async (id) =>
  await api.delete(`/bills/delete-payment/${id}`);

// PUT
const closeBillPayment = async (id) => await api.put(`/bills/close-bill/${id}`);

const updateBillItem = async (data) =>
  await api.put(`/bills/update-item`, data);

const updateBillSeller = async (data) => await api.post("/bills/update", data);

const reopenBillPayment = async (id) =>
  await api.put(`/bills/reopen-bill/${id}`);

const removeBillItem = async (id) => await api.put(`/bills/delete-item/${id}`);

const updateConferencePayment = async (data) =>
  await api.post("/daily-cashiers/update-conference", data);

const removeBill = async (id) => await api.put(`/bills/exclude-bill/${id}`);

const updateExpirationDate = async (data) =>
  await api.put("/bills/update-expiration", data);

const updateFinancialResponsible = async (data) =>
  await api.put("/bills/financial-responsible", data);

export const billService = {
  getAllBills,
  getBillProducts,
  getSingleBill,
  getFiscalData,

  createBill,
  createBillItem,
  createBillPayment,
  convertBillToTreatment,
  createMultipleItems,
  verifyDiscount,

  removeBillPayment,
  removeBillPaymentBlock,
  removeBill,

  closeBillPayment,
  reopenBillPayment,
  updateBillItem,
  removeBillItem,
  updateConferencePayment,
  updateExpirationDate,
  updateBillSeller,
  updateFinancialResponsible,
};
