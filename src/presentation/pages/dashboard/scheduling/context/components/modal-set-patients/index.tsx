import { useEffect } from "react";
import { FormSetClients } from "./form-set-patients";
import { useScheduling } from "@/presentation";
import { Modal } from "infinity-forge";

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
      style={{ maxWidth: "80vw", padding: "10px", overflow: "auto", height: "95vh" }}
      modal={!!modalPatients}
      children={<FormSetClients />}
      setModal={setModalPatients as any}
      trigger={undefined}
    />
  );
}
