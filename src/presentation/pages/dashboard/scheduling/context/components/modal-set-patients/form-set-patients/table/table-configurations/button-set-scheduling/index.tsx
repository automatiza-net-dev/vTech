import { useState } from "react";

import { Button, useToast } from "infinity-forge";

import { useScheduling, PermissionItem, Pets, useAssignTutor } from "@/presentation";

import { ModalSelectActiveTutor } from "../modal-select-active-tutor";

import * as S from "./styles";
import { Tutor } from "@/domain";
import { useQueryClient } from "react-query";

export function ButtonSetSchedulling(props) {
  const [modal, setModal] = useState(false);

  const modalPatients = useScheduling((state) => state.modalPatients);
  const setCreateSchedulingArgs = useScheduling(
    (state) => state.setCreateSchedulingArgs
  );
  const patientFilters = useScheduling((state) => state.patientsFilters);

  const { createToast } = useToast();

  const mainTutor =
    props.tutors.length > 0 &&
    (props.tutors.find((tutor) => tutor.isMain) as Tutor);

  const avulseTutor = props.tutors?.[0];

  const hasActiveTutor = !!mainTutor;

  const tutor = mainTutor || avulseTutor;

   const assignutor = useAssignTutor()

   const queryClient = useQueryClient()


  return (
    <PermissionItem hash="AGE01">
      <S.ButtonSetSchedulling>
        <ModalSelectActiveTutor {...props} modal={modal} setModal={setModal} />

        {!props.name && tutor ? (
          <Pets
            addPet={{
              onLinkPet: async (data) => {
                await assignutor.mutateAsync({
                  holder: tutor.id,
                  patient: data.patientId,
                })

                await queryClient.invalidateQueries(["RemoteLoadSchedulesPatients", patientFilters])

                createToast({ message: "Vinculado com sucesso", status: "success" })
              },
            }}
            tutor={tutor}
            tutorId={tutor.id}
          />
        ) : (
          <Button
            text="AGENDAR"
            type="button"
            onClick={() => {
              if (!hasActiveTutor) {
                setModal(true);

                return;
              }

              if (props.tutors.length === 0) {
                createToast({
                  message: "Cadastre um tutor para agendar.",
                  status: "error",
                });

                return;
              }

              setCreateSchedulingArgs({
                ...modalPatients,
                ...props,
                type: "create",
              });
            }}
          />
        )}
      </S.ButtonSetSchedulling>
    </PermissionItem>
  );
}
