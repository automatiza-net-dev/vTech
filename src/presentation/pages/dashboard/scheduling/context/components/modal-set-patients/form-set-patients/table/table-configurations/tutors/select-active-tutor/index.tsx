import { useState } from "react";

import * as yup from "yup";
import { useQueryClient } from "react-query";
import { FormHandler, InputRadio, useToast } from "infinity-forge";

import {
  Error,
  Modal,
  useScheduling,
  useSetMainTutor,
} from "@/presentation";

import { ISelectActiveTutorProps } from "./interfaces";

import * as S from "./styles";

export function SelectActiveTutor({ id, tutors }: ISelectActiveTutorProps) {
  const [modal, setModal] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const setMainTutor = useSetMainTutor();
  const patientsFilters = useScheduling((state) => state.patientsFilters);

  async function handleSuccess(params) {
    await setMainTutor.mutateAsync({
      ...params,
      patient: id,
    });

    await queryClient.invalidateQueries({
      queryKey: ["RemoteLoadSchedulesPatients", patientsFilters],
    });

    setModal(false);

    toast.success("Tutor ativo vinculado com sucesso!", {
      autoClose: 4000,
      position: "top-right",
    });
  }

  return (
    <Error name="SelectActiveTutor">
      <S.SelectActiveTutor>
        <Modal
          maxwidth="600px"
          stateModal={modal}
          onCloseModal={() => setModal(false)}
          setModal={setModal}
          title="Selecionar tutor ativo"
        >
          <FormHandler
            schema={{
              holder: yup.string().required("Por favor, selecione um tutor."),
            }}
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
        </Modal>

        <button
          className="open-vinc-tutor-button"
          onClick={() => setModal(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
            enableBackground="new 0 0 52 52"
            xmlSpace="preserve"
          >
            <path
              d="M20,37.5c0-0.8-0.7-1.5-1.5-1.5h-15C2.7,36,2,36.7,2,37.5v11C2,49.3,2.7,50,3.5,50h15c0.8,0,1.5-0.7,1.5-1.5
	V37.5z"
            />
            <path
              d="M8.1,22H3.2c-1,0-1.5,0.9-0.9,1.4l8,8.3c0.4,0.3,1,0.3,1.4,0l8-8.3c0.6-0.6,0.1-1.4-0.9-1.4h-4.7
	c0-5,4.9-10,9.9-10V6C15,6,8.1,13,8.1,22z"
            />
            <path
              d="M41.8,20.3c-0.4-0.3-1-0.3-1.4,0l-8,8.3c-0.6,0.6-0.1,1.4,0.9,1.4h4.8c0,6-4.1,10-10.1,10v6
	c9,0,16.1-7,16.1-16H49c1,0,1.5-0.9,0.9-1.4L41.8,20.3z"
            />
            <path
              d="M50,3.5C50,2.7,49.3,2,48.5,2h-15C32.7,2,32,2.7,32,3.5v11c0,0.8,0.7,1.5,1.5,1.5h15c0.8,0,1.5-0.7,1.5-1.5
	V3.5z"
            />
          </svg>
        </button>
      </S.SelectActiveTutor>
    </Error>
  );
}
