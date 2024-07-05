import { useState } from "react";

import { useQueryClient } from "react-query";
import {
  Error,
  Select,
  Modal,
  useToast,
  FormHandler,
  LoaderCircle,
} from "infinity-forge";

import {
  useScheduling,
  useAssignTutor,
  useSetMainTutor,
  useLoadAllPatientTutor,
} from "@/presentation";
import { Tutor } from "@/domain";
import { ButtonCreateTutor } from "./button-create-tutor";

import * as S from "./styles";

export function AddTutor({ id }: { id: string; tutors: Tutor[] }) {
  const [modal, setModal] = useState(false);
  const [initialHolder, setInitialHolder] = useState(null);

  const { createToast } = useToast();
  const assignutor = useAssignTutor();
  const queryClient = useQueryClient();
  const setMainTutor = useSetMainTutor();

  const patientsFilters = useScheduling((state) => state.patientsFilters);

  const { data, refetch, isLoading } = useLoadAllPatientTutor({});

  async function hanldeOnSuccess(param) {
    await assignutor.mutateAsync({
      ...param,
      patient: id,
    });

    await setMainTutor.mutateAsync({
      holder: param.holder,
      patient: id,
    });

    await queryClient.invalidateQueries({
      queryKey: ["RemoteLoadSchedulesPatients", patientsFilters],
    });

    await queryClient.invalidateQueries({
      queryKey: "RemoteLoadAllPatientTutor",
    });

    createToast({
      message: "Tutor vinculado com sucesso!",
      status: "success",
    });

    setModal(false);
  }

  return (
    <Error name="AddTutor">
      <Modal
        styles={{ maxWidth: "600px", width: "100%", paddingBottom: "20px" , overflow: "unset"}}
      stylesContent={{ overflow: "unset" }}  
        open={modal}
        onClose={() => setModal(false)}
      >
        {isLoading ? (
          <LoaderCircle size={20} />
        ) : (
          <S.ModalContent>
            <FormHandler
              isStickyButtons
              onSucess={hanldeOnSuccess}
              button={{ text: "Vincular" }}
              customAction={
                {
                  props: { refetch, setInitialHolder },
                  Component: ButtonCreateTutor,
                } as any
              }
              initialData={{ holder: initialHolder }}
            >
              <div className="select-box">
                <Select
                  label="Selecione o tutor a ser vinculado"
                  loading={isLoading}
                  name="holder"
                  onlyOneValue
                  options={
                    data?.map((item) => ({
                      label:
                        item?.name +
                        " / " +
                        item?.document +
                        " / " +
                        item?.cellphone,
                      value: item.id || "",
                    })) || []
                  }
                />
              </div>
            </FormHandler>
          </S.ModalContent>
        )}
      </Modal>

      <S.AddTutor onClick={() => setModal(true)} data-cy="add_tutor">
        <svg
          viewBox="0 0 16 16"
          height="20"
          width="20"
          aria-hidden="true"
          focusable="false"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path>
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
        </svg>
      </S.AddTutor>
    </Error>
  );
}
