// @ts-nocheck
import api from "@/OLD/services";

const getTutors = async (params) => {
  return api.get(`/patient-tutors`, { params });
};

const getNonPatients = async (params: Record<string, any>) => {
  return api.get(`/patient-tutors/all`, { params });
};

const getSingleTutor = async (id) => {
  return api.get(`/patient-tutors/${id}`);
};

const getTutorOrigins = async (params) => {
  return await api.get(`/client-origins`, { params });
};

const getUniqueOrigins = async (params) => {
  return await api.get(`/patients/unique-origins`, { params });
};

const getPatients = async (params) => {
  return (
    await api.get(`patients/animals`, {
      params,
    })
  ).data;
};

const getSinglePatient = async (id) => {
  return api.get(`/patients/${id}`);
};

const checkPhone = async (data) =>
  await api.post("/patients/check-phone", data);

const getPatientMetadata = async (id) => api.get(`/patients/metadata/${id}`);

const getPatientSalesMetadata = async (id: string, tutorID?: string) =>
  api.get<
    {
      id: string;
      _type: string;
      tag: string;
      date: string;
      seller: string;
      clientID: string;
      client: string;
      patientID?: string;
      total_value: string;
      pending: boolean;
      missing_value: string;
      status: string;
      items: Array<{
        id: string;
        quantity: number;
        cost_value: number | null;
        sale_value: number;
        unitary_value: number;
        discount_value: number;
        total_value: number;
        fiscal_operation_code: string;
        fiscal_benefit_code: any;
        icms_origin_product: string;
        icms_cst: any;
        icms_base: any;
        icms_percentage: any;
        icms_value: any;
        icms_percentage_red_aliquot: any;
        icms_percentage_red_base: any;
        icms_deferred_value: number;
        icms_partition_value: number;
        icms_fcp_percentage: number;
        icms_fcp_value: number;
        icms_partition_origin_uf_percentage: number;
        icms_partition_destination_uf_percentage: any;
        icms_partition_inter_uf_percentage: any;
        icms_partition_origin_uf_value: any;
        icms_partition_destination_uf_value: any;
        icms_st_base: any;
        icms_st_percentage_red_base: any;
        icms_st_iva: any;
        icms_st_percentage_uf_destination: any;
        icms_st_value: any;
        iss_cst: string;
        iss_base: number;
        iss_percentage: number;
        iss_value: number;
        pis_base: number;
        pis_percentage: number;
        pis_value: number;
        pis_retention_value: number;
        cofins_base: number;
        cofins_percentage: number;
        cofins_value: number;
        cofins_retention_value: number;
        ipi_base: number;
        ipi_percentage: number;
        ipi_value: number;
        ibpt_city_percentage: any;
        ibpt_state_percentage: any;
        ibpt_country_percentage: any;
        status: string;
        created_at: string;
        updated_at: string;
        pis_cst: string;
        cofins_cst: string;
        disabled_at: any;
        ipi_cst: string;
        nfe_issued: boolean;
        icms_deferred_operation_value: any;
        icms_deferred_percentage: any;
        data_document: any;
        courtesy: boolean;
        courtesy_approved_at: any;
        max_discount: boolean;
        pending_observations: any;
        approved: boolean;
        cancelled: any;
        reviewCancelDate: any;
        reviewCancelNotes: any;
        originalTotalValue: number;
        originalQuantity: number;
        cancelledQuantity: any;
        productVariation: {
          id: string;
          product_id: string;
          barcode: any;
          active: boolean;
          created_at: string;
          updated_at: string;
          product: {
            id: string;
            economic_group_id: string;
            description: string;
            type: string;
            reference_code: string;
            collection_year: any;
            ncm: any;
            cest: any;
            features: any;
            active: boolean;
            created_at: string;
            updated_at: string;
            variation_group_id: string;
            icms_origin: string;
            tax_benefit_code: any;
            anvisa_code: any;
            service_code: string;
            purpose: string;
            service_type: any;
            fractioned: boolean;
            fraction_value: number;
            courtesy: boolean;
            productivityItem: boolean;
            contract: any;
          };
        };
      }>;
      patient?: string;
    }[]
  >(`/patients/sales-metadata/${id}?tutor=${tutorID}`);

const getPatientHairTypes = async () => await api.get("/patient-animal-hairs");

const getTutorProfessions = async () => await api.get("/professions");

const assignPatientToTutor = async (data) => {
  return await api.post("patient-tutors/assign", data);
};

const createTutor = async (data) => {
  return api.post("patient-tutors", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const deathPatient = async (data, patientId) => {
  return api.put(`patients/declare-death/${patientId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const createPatient = async (data) => {
  return api.post("/patients", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const fastPatientRegister = async (data) =>
  await api.post("/patients/fast", data);

const editPatient = async (data, id) => {
  return api.put(`/patients/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const editTutor = async (data, id) => {
  return api.put(`/patient-tutors/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const setMainTutor = async (patientId, tutorId) =>
  await api.put(`/patients/main/${patientId}/${tutorId}`);

const deletePatient = async (id) => {
  return api.delete(`/patients/${id}`);
};

export const petsService = {
  deathPatient,
  getTutors,
  getSingleTutor,
  getTutorProfessions,
  getUniqueOrigins,
  createTutor,
  editTutor,
  assignPatientToTutor,
  getPatients,
  createPatient,
  editPatient,
  getSinglePatient,
  deletePatient,
  getTutorOrigins,
  checkPhone,
  setMainTutor,
  fastPatientRegister,
  getPatientMetadata,
  getPatientSalesMetadata,
  getPatientHairTypes,
  getNonPatients,
};
