import api from "@/OLD/services";

import { api as apiInfinity } from "infinity-forge";

const normalize = (str?: string) =>
  str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "") ?? undefined;

const getAllBills = async (params) => {
  const response = await apiInfinity({
    method: "get",
    url: "bills",
    body: {
      ...params,
      clientName: normalize(params?.clientName),
      patientName: normalize(params?.patientName),
    },
  });

  return response;
};

const getAgregateClientPayments = async (tutorID: string) => {
  const { data } = await api.get(`/bills/aggregate-client-payments/${tutorID}`);

  return data as { total: number };
};

const getClientPaymentSales = async (id: string) => {
  const { data } = await api.get(`/bills/client-payment-sales/${id}`);

  return data;
};

const getSingleBill = async (id) => {
  const { data } = await api.get(`/bills/show/${id}`);

  return data as {
    id: string
    bill_date: string
    product_value: number
    service_value: number
    discount_value: number
    fee_value: any
    delivery_value: number
    total_value: number
    icms_base: number
    icms_value: number
    icms_st_base: number
    icms_st_value: number
    iss_base: number
    iss_value: number
    pis_base: number
    pis_value: number
    pis_retention_value: number
    cofins_base: number
    cofins_value: number
    cofins_retention_value: number
    ipi_base: number
    ipi_value: number
    icms_deferred_value: number
    icms_fcp_value: number
    icms_uf_origin_value: number
    icms_uf_destination_value: number
    other_value: number
    additional_information: any
    cancelled_at: any
    cancellation_observation: any
    status: "BAIXADA" | "ABERTA" | "Venda em Aberto" | "Nao Aprovada"
    created_at: any
    updated_at: any
    tag: string
    closing_date: any
    paid_value: number
    document_status: 'Gerados'
    pending: boolean
    internalCode: any
    origin_bill_id: any
    cancelled: any
    cancelDate: any
    finishCancelDate: any
    cancelReason: any
    cancelNotes: any
    cancelValueProducts: number
    cancelValueServices: number
    cancelValueTotal: number
    originalTotalValue: number
    originalProductsValue: number
    originalServicesValue: number
    originalDiscountValue: number
    billType: string
    transferConfirmationDate: any
    destinationUnit: any
    businessUnit: {
      id: string
      identification: string
      document: string
      fantasy_name: string
      company_name: string
      email: string
      phone: string
      origin: any
      postal_code: string
      address: string
      number: string
      complement: string
      district: string
      city: string
      state: string
      lat: any
      lng: any
      active: boolean
      created_at: Date | string
      updated_at: Date | string
      state_registration: any
      city_registration: any
      cnae: any
      simple: boolean
      city_code: any
      environment: string
      status: string
      tributation_code: any
    }
    financialResponsible: {
      id: string
      name: string
    }
    cancelUser: any
    finishCancelUser: any
    confirmationUser: any
    relatedReceipt: any
    _cancelReason: any
    billRelatedType: any
    patient: {
      id: string
      name: string
      type: string
      photo: any
      gender: string
      tags: string
      birthDate: any
      active: boolean
      created_at: string
      updated_at: string
      vaccine_origin: any
      tag: string
      weight: any
      weight_date: any
      weight_origin: any
      hypertension: boolean
      diabetes: boolean
      glycemia: any
      pressure: any
      first_sale: string
      client_origin_item_description: any
      community: boolean
      last_sale: string
      externalCode: any
      birth_date: any
    }
    seller: {
      id: string
      name: string
      email: string
      document: string
      phone: string
      profile_picture: any
      postal_code: string
      address: string
      number: string
      complement: string
      district: string
      city: string
      state: string
      remember_me_token: any
      active: boolean
      created_at: string
      updated_at: string
      licensing_job: string
      inscription: string
      birth_date: string
      on_duty: boolean
      type: string
      signature_image_path: string
    }
    user: {
      id: string
      name: string
      email: string
      document: string
      phone: string
      profile_picture: any
      postal_code: string
      address: string
      number: string
      complement: string
      district: string
      city: string
      state: string
      remember_me_token: any
      active: boolean
      created_at: string
      updated_at: string
      licensing_job: string
      inscription: string
      birth_date: string
      on_duty: boolean
      type: string
      signature_image_path: string
    }
    budget: any
    documents: Array<any>
    client: {
      id: string
      name: string
      type: string
      photo: any
      gender: any
      tags: string
      birthDate: any
      active: boolean
      created_at: string
      updated_at: string
      vaccine_origin: any
      tag: string
      weight: any
      weight_date: any
      weight_origin: any
      hypertension: boolean
      diabetes: boolean
      glycemia: any
      pressure: any
      first_sale: string
      client_origin_item_description: any
      community: boolean
      last_sale: string
      externalCode: any
      tutor: {
        id: string
        patient_id: string
        document: any
        inscription: any
        corporateName: any
        email: any
        cellphone: string
        telephone: any
        message_person_name: any
        message_person_phone: any
        postal_code: any
        street: any
        number: any
        complement: any
        district: any
        city: any
        state: any
        created_at: string
        updated_at: string
        residence: any
        city_code: any
        nationality: any
        civil_status: any
        account_plan_id: any
        fullAddress: string
      }
      birth_date: any
    }
    payments: Array<{
      id: string
      block: number
      expiration_date: string
      fee_type: string
      fee_value: number
      fee_percentage: number
      installment_value: number
      total_value: number
      status: any
      created_at: string
      updated_at: string
      installments: number
      nsu_document: any
      payment_method_discount_percentage: number
      payment_method_discount_value: number
      conference_date: any
      qty_installments: number
      printed_at: string
      pending: boolean
      approved: boolean
      approved_at: any
      reason: any
      cancelled: any
      reviewCancelDate: any
      reviewCancelNotes: any
      approvedUser: any
      acquirer: {
        id: string
        description: string
      }
      flag: {
        id: string
        description: string
        code: string
        type: string
      }
      paymentMethod: {
        id: string
        description: string
        requires_document: boolean
        tef: string
        type: string
        fee: number
        automatic_cancellation: boolean
        days_first_installment: number
        days_between_installments: number
        days_until_transfer: number
        installments_without_password: number
        max_installments: number
        allow_change_expiration_date: boolean
        minimum_installment_value: number
        active: boolean
        created_at: string
        updated_at: string
        usage: string
        nfe_code: string
        openInstallmentsAffectsBlock: boolean
      }
      reviewerCancelUser: any
      finance: {
        id: string
        payment_date: any
        paymentMethod: {
          id: string
          description: string
        }
      }
      finances: Array<{
        id: string
        payment_date: string | null
        expiration_date: string | null
        total_value: number
        original_value: number
        value: number
        payment_value: number
        paymentMethod: {
          id: string
          description: string
        }
      }>
    }>
    items: Array<{
      id: string
      quantity: number
      cost_value: any
      sale_value: number
      unitary_value: number
      discount_value: number
      total_value: number
      fiscal_operation_code: string
      fiscal_benefit_code: any
      icms_origin_product: string
      icms_cst: any
      icms_base: any
      icms_percentage: any
      icms_value: any
      icms_percentage_red_aliquot: any
      icms_percentage_red_base: any
      icms_deferred_value: number
      icms_partition_value: number
      icms_fcp_percentage: number
      icms_fcp_value: number
      icms_partition_origin_uf_percentage: number
      icms_partition_destination_uf_percentage: any
      icms_partition_inter_uf_percentage: any
      icms_partition_origin_uf_value: any
      icms_partition_destination_uf_value: any
      icms_st_base: any
      icms_st_percentage_red_base: any
      icms_st_iva: any
      icms_st_percentage_uf_destination: any
      icms_st_value: any
      iss_cst: string
      iss_base: number
      iss_percentage: number
      iss_value: number
      pis_base: number
      pis_percentage: number
      pis_value: number
      pis_retention_value: number
      cofins_base: number
      cofins_percentage: number
      cofins_value: number
      cofins_retention_value: number
      ipi_base: number
      ipi_percentage: number
      ipi_value: number
      ibpt_city_percentage: any
      ibpt_state_percentage: any
      ibpt_country_percentage: any
      status: string
      created_at: string
      updated_at: string
      pis_cst: string
      cofins_cst: string
      disabled_at: any
      ipi_cst: string
      nfe_issued: boolean
      icms_deferred_operation_value: any
      icms_deferred_percentage: any
      data_document: any
      courtesy: boolean
      courtesy_approved_at: any
      max_discount: boolean
      pending_observations: any
      approved: boolean
      cancelled: any
      reviewCancelDate: any
      reviewCancelNotes: any
      originalTotalValue: number
      originalQuantity: number
      cancelledQuantity: any
      taxRule: {
        id: string
      }
      courtesyIssuedUser: any
      courtesyApprovedUser: any
      reviewerCancelUser: any
      productVariation: {
        id: string
        product_id: string
        barcode: any
        active: boolean
        created_at: string
        updated_at: string
        variationOptions: Array<any>
        product: {
          id: string
          economic_group_id: string
          description: string
          type: string
          reference_code: string
          collection_year: any
          ncm: any
          cest: any
          features: any
          active: boolean
          created_at: string
          updated_at: string
          variation_group_id: string
          icms_origin: string
          tax_benefit_code: any
          anvisa_code: any
          service_code: string
          purpose: string
          service_type: any
          fractioned: boolean
          fraction_value: number
          courtesy: boolean
          productivityItem: boolean
          contract: any
          codigoNbs: any
        }
        businessUnitProducts: Array<{
          id: string
          maximum_discount_percentage: number
          product_variation_id: string
        }>
      }
      treatmentExecutions: Array<any>
      departmentItems: Array<any>
    }>
    additionalInformation: any
  }
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

const convertBillToTreatment = async (form) => {
  const { data } = await api.post("/bills/create-treatment", form);

  return data;
};

const verifyDiscount = async (data) =>
  await api.post("/bills/check-item-discount", data);

// PUT
const closeBillPayment = async (id) => await api.put(`/bills/close-bill/${id}`);

const updateBillItem = async (data) =>
  await api.put(`/bills/update-item`, data);

const updateBillSeller = async (data) => await api.post("/bills/update", data);

const reopenBillPayment = async (id) =>
  await api.put(`/bills/reopen-bill/${id}`);

const removeBillItem = async (id) => await api.put(`/bills/delete-item/${id}`);

const removeClientPayment = async (id: number) =>
  await api.delete(`/bills/delete-client-payment/${id}`);

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
  convertBillToTreatment,
  createMultipleItems,
  verifyDiscount,
  removeBill,
  closeBillPayment,
  reopenBillPayment,
  updateBillItem,
  removeBillItem,
  updateConferencePayment,
  updateExpirationDate,
  updateBillSeller,
  updateFinancialResponsible,
  removeClientPayment,
  getAgregateClientPayments,
  getClientPaymentSales,
};
