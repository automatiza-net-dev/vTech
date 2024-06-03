import api from "@/OLD/services";

const getAllFiscalDocuments = async ({ document, movement }) => {
  const { data } = await api.get("/fiscal-documents", {
    params: {
      document,
      movement
    }
  });

  if (!data) return [];

  return data;
};

const getAllUnitFiscalDocuments = async ({ document, movement }) => {
  const { data } = await api.get("/fiscal-documents/business-unit/search", {
    params: {
      document,
      movement
    }
  });

  if (!data) return [];

  return data;
};

const authorizeNfse = async (data) => {
  return await api.post("/fiscal-documents/business-unit/authorize-nfse", data);
};

const getIssuedNfse = async ({ bill }) => {
  const { data } = await api.get(
    "/fiscal-documents/business-unit/issued-nfse",
    {
      params: {
        bill
      }
    }
  );

  if (!data) return [];

  return data;
};

const updateIssuedNfse = async ({ id }) => {
  await api.post(`fiscal-documents/business-unit/update/nfse/${id}`);
};

const cancelIssuedNfse = async ({ data }) => {
  await api.post(`fiscal-documents/business-unit/cancel-nfse`, data);
};

//
const authorizeNfe = async (data) => {
  return await api.post("/fiscal-documents/business-unit/authorize", data);
};

const getIssuedNfe = async ({ bill }) => {
  const { data } = await api.get("/fiscal-documents/business-unit/issued-nfe", {
    params: {
      bill
    }
  });

  if (!data) return [];

  return data;
};

const updateIssuedNfe = async ({ id }) => {
  await api.post(`fiscal-documents/business-unit/update/nfe/${id}`);
};

const cancelIssuedNfe = async ({ data }) => {
  await api.post(`fiscal-documents/business-unit/cancel-nfe`, data);
};

const disableIssuedNfe = async ({ data }) => {
  await api.post(`fiscal-documents/business-unit/disable`, data);
};

export const fiscalDocumentService = {
  getAllFiscalDocuments,
  getAllUnitFiscalDocuments,

  authorizeNfse,
  getIssuedNfse,
  updateIssuedNfse,
  cancelIssuedNfse,

  authorizeNfe,
  getIssuedNfe,
  updateIssuedNfe,
  cancelIssuedNfe,
  disableIssuedNfe
};
