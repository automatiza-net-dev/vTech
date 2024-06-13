import { useEffect } from "react";

import { Modal } from "infinity-forge";

import { useScheduling } from "@/presentation";
import { FormSetClients } from "./form-set-patients";

export function ModalSetPatients() {
  const modalPatients = useScheduling((state) => state.modalPatients);
  const setModalPatients = useScheduling((state) => state.setModalPatients);
  const setPatientsFilters = useScheduling((state) => state.setPatientsFilters);

  useEffect(() => {
    if (!modalPatients) {
      setPatientsFilters(null);
    }
  }, [modalPatients]);

  if (!modalPatients) {
    return <></>;
  }

  return (
    <Modal
      styles={{
        maxWidth: "80vw",
        padding: "10px",
        overflow: "auto",
        maxHeight: "95vh"
      }}
      open={!!modalPatients}
      onClose={() => setModalPatients(null)}
    >
      <FormSetClients />
    </Modal>
  );
}
