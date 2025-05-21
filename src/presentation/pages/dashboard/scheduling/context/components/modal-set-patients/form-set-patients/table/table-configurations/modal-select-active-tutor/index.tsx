import { Dispatch, SetStateAction } from "react";

import {
  Modal,
  Error,
  useToast,
  InputRadio,
  FormHandler,
  useQueryClient
} from "infinity-forge";

import { Tutor } from "@/domain";
import { useLoadSchedulesPatientsKEY, useSetMainTutor } from "@/presentation";

import * as S from "./styles";

export function ModalSelectActiveTutor({
  modal,
  setModal,
  id,
  tutors = [],
}: {
  id: string;
  tutors: Tutor[];
  modal: boolean;
  setModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { createToast } = useToast();
  const setMainTutor = useSetMainTutor();

  const refetch  = useQueryClient(state => state.refetch);

  const queryKeyLoadSchedulesPatients = useLoadSchedulesPatientsKEY();

  async function handleSuccess(params) {
    try {

      await setMainTutor.mutateAsync({
        ...params,
        patient: id,
      });

      setModal(false);

      createToast({
        message: "Tutor ativo vinculado com sucesso!",
        status: "success",
      });

      refetch(queryKeyLoadSchedulesPatients)

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
