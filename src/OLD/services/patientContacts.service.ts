import api from "@/OLD/services";

const createContact = async (data) => await api.post("/patient-contacts", data);

const createContactsBatch = async (data) =>
  await api.post("/patient-contacts/batch", data);

const updateContactsBatch = async (data) =>
  await api.put("/patient-contacts/batch", data);

export const patientContactsService = {
  createContact,
  createContactsBatch,
  updateContactsBatch
};
