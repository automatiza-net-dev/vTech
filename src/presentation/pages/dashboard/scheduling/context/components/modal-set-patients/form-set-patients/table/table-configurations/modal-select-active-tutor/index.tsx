import { Dispatch, SetStateAction } from "react";

import { useQueryClient } from "react-query";

import { Error, FormHandler, InputRadio, useToast } from "infinity-forge";

import { LoadSchedulesPatient, SchedulePatient, Tutor } from "@/domain";
import { Modal, useScheduling, useSetMainTutor } from "@/presentation";

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

      queryClient.setQueryData(["RemoteLoadSchedulesPatients", patientsFilters], (state) => {
        const queryData = state as  SchedulePatient[];

        const updatedCache = queryData.map(item => {
          if(item.id === id) {

            return {
              ...item,
              tutors: item.tutors.map(tutor => {
                if(tutor.id === tutorId) {
                  return {...tutor, isMain: true}
                }

                return {...tutor, isMain: false}
              })
            }
          }

          return item;
        })
  
        return updatedCache as  SchedulePatient[];
      });
  

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
      maxwidth="600px"
      stateModal={modal}
      onCloseModal={() => setModal(false)}
      setModal={setModal}
      title="Selecionar tutor ativo"
    >
      <Error name="modal-select-active-tutor">
        <FormHandler
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
