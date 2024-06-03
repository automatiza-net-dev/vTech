import { useEffect } from "react";
import { FormSetClients } from "./form-set-patients";
import { Modal, useScheduling } from "@/presentation";

export function ModalSetPatients() {
  const modalPatients = useScheduling((state) => state.modalPatients);
  const setModalPatients = useScheduling((state) => state.setModalPatients);
  const setPatientsFilters = useScheduling((state) => state.setPatientsFilters);

  useEffect(() => {
    if(!modalPatients) {
      setPatientsFilters(null)
    }
  }, [modalPatients])

  if (!modalPatients) {
    return <></>;
  }

  return (
    <Modal
      maxwidth="80vw"
      stateModal={true}
      title="Selecionar paciente"
      warning={process.env.client === "sancla" ? "O tutor ativo será o tutor responsável dentro do atendimento" : ""}
      onCloseModal={() => setModalPatients(null)}
    >
      <FormSetClients />
    </Modal>
  );
}
