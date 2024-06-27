import { Dispatch, SetStateAction } from "react";

import { useQueryClient } from "react-query";

import {
  Modal,
  Error,
  useToast,
  InputRadio,
  FormHandler,
} from "infinity-forge";

import { SchedulePatient, Tutor } from "@/domain";
import { useScheduling, useSetMainTutor } from "@/presentation";

import * as S from "./styles";

export function ModalSelectActiveTutor({
  modal,
  setModal,
  id,
  tutors,
}: {
  id: string;
  tutors: Tutor[];
  modal: boolean;
  setModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { createToast } = useToast();
  const queryClient = useQueryClient();

  const setMainTutor = useSetMainTutor();
  const patientsFilters = useScheduling((state) => state.patientsFilters);

  async function handleSuccess(params) {
    try {
      const tutorId = params.holder;

      await setMainTutor.mutateAsync({
        ...params,
        patient: id,
      });

      queryClient.setQueryData(
        ["RemoteLoadSchedulesPatients", patientsFilters],
        (state) => {
          const queryData = state as SchedulePatient[];

          const updatedCache = queryData.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                tutors: item.tutors.map((tutor) => {
                  if (tutor.id === tutorId) {
                    return { ...tutor, isMain: true };
                  }

                  return { ...tutor, isMain: false };
                }),
              };
            }

            return item;
          });

          return updatedCache as SchedulePatient[];
        }
      );

      setModal(false);

      createToast({
        message: "Tutor ativo vinculado com sucesso!",
        status: "success",
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Modal
      styles={{ maxWidth: "600px", width: "100%" }}
      open={modal}
      onClose={() => setModal(false)}
    >
      <Error name="modal-select-active-tutor">
        <h3 className="font-18-bold">Selecionar tutor ativo</h3>

        <FormHandler
          isStickyButtons
          onSucess={handleSuccess}
          button={{ text: "Alterar" }}
          initialData={{ holder: tutors.find((tutor) => tutor.isMain)?.id }}
        >
          <S.ModalContent>
            <InputRadio
              name="holder"
              options={tutors.map((tutor) => ({
                value: tutor.id,
                label: tutor.name,
              }))}
            />
          </S.ModalContent>
        </FormHandler>
      </Error>
    </Modal>
  );
}
