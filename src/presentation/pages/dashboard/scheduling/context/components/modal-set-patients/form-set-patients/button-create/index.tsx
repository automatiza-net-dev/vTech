import { useState } from "react";
import { useQueryClient } from "react-query";

import { Modal, PermissionItem } from "@/presentation";
import { CreateTutor } from "@/OLD/components/Tutor/Create";
import { CreatePatient } from "@/OLD/components/Patient/Create";

import { Button } from "infinity-forge";

import * as S from "./styles";

export function ButtonCreate({ patientFilters }) {
  const [visible, setVisible] = useState(false);

  const queryClient = useQueryClient();

  const props = {
    setVisible,
    isSchedule: true,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["RemoteLoadAllPatientTutor", patientFilters],
      });
      queryClient.invalidateQueries({
        queryKey: ["RemoteLoadSchedulesPatients", patientFilters],
      });
    },
  };

  return (
    <PermissionItem hash={process.env.client === "sancla" ? "PET01" : "TUT01"}>
      <S.ButtonCreate>
        {visible && (
          <Modal stateModal={visible} maxwidth="1200px" setModal={setVisible}>
            {process.env.client === "sancla" ? (
              <CreatePatient {...props} />
            ) : (
              <CreateTutor {...props} />
            )}
          </Modal>
        )}

        <Button
          text="Cadastrar novo paciente"
          type="button"
          onClick={() => setVisible(true)}
        />
      </S.ButtonCreate>
    </PermissionItem>
  );
}
