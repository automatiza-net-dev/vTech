import { useState } from "react";

import { Button, useToast } from "infinity-forge";
import { useQueryClient } from "infinity-forge"

import {
  Pets,
  useScheduling,
  PermissionItem,
  useAssignTutor,
  useLoadSchedulesPatientsKEY,
} from "@/presentation";
import { Tutor } from "@/domain";

import { ModalSelectActiveTutor } from "../modal-select-active-tutor";

import * as S from "./styles";

export function ButtonSetSchedulling(props) {
  const [modal, setModal] = useState(false);

  const modalPatients = useScheduling((state) => state.modalPatients);
  const setCreateSchedulingArgs = useScheduling((state) => state.setCreateSchedulingArgs);

  const { createToast } = useToast();

  const mainTutor =
    props.tutors && props.tutors.length > 0 &&
    (props.tutors.find((tutor) => tutor.isMain) as Tutor);

  const avulseTutor = props.tutors?.[0];

  const hasActiveTutor = !!mainTutor;

  const tutor = mainTutor || avulseTutor;

  const assignutor = useAssignTutor();

  const {refetch} = useQueryClient();
  const queryKeyLoadSchedulePatients = useLoadSchedulesPatientsKEY();

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
                });

                refetch(queryKeyLoadSchedulePatients);

                createToast({
                  message: "Vinculado com sucesso",
                  status: "success",
                });
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
                  message: "Cadastre um responsável para agendar.",
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
