import api from "@/OLD/services";

const create = async (data) =>
  await api.post("/hospitalization-prescriptions", data);

const update = async (id, data) =>
  await api.put(`/hospitalization-prescriptions/${id}`, data);

const list = async ({ hospitalization, from, to }) =>
  await api.get(
    `/hospitalization-prescriptions${
      hospitalization ? `?hospitalization=${hospitalization}` : ""
    }${from ? `${hospitalization ? "&" : "?"}from=${from}` : ""}${
      to ? `${hospitalization || from ? "&" : "?"}to=${to}` : ""
    }`
  );

const getById = async (id) =>
  await api.get(`/hospitalization-prescriptions/show/${id}`);

const getAllMedicalPrescriptionSchedulling = async ({ from, to }) =>
  await api.get(
    `/hospitalization-prescriptions/scheduling/?from=${from}&to=${to}`
  );

const updateScheduling = async (id, data) =>
  await api.put(`/hospitalization-prescriptions/schedule/${id}`, data);

const interruptPrescription = async (id) =>
  await api.put(`/hospitalization-prescriptions/interrupt/${id}`);

const excludePrescription = async (id) =>
  await api.put(`/hospitalization-prescriptions/exclude/${id}`);

export const hospitalizationPrescriptionsService = {
  create,
  update,
  list,
  getById,
  updateScheduling,
  getAllMedicalPrescriptionSchedulling,
  interruptPrescription,
  excludePrescription
};
