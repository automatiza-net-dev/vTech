import { useState } from "react";
import {
  Select,
  FormHandler,
  useToast,
  LoaderCircle,
  useQueryClient,
} from "infinity-forge";

import {
  useAssignTutor,
  useSetMainTutor,
  useLoadAllPatientTutor,
  useLoadSchedulesPatientsKEY,
  useLoadAllPatientTutorKEY,
} from "@/presentation";
import { ButtonCreateTutor } from "../button-create-tutor";

export function AddTutorContent({ id, setModal, origin }) {
  const [initialHolder, setInitialHolder] = useState(null);

  const { createToast } = useToast();
  const assignutor = useAssignTutor();
  const setMainTutor = useSetMainTutor();

  const { data, mutate, isLoading } = useLoadAllPatientTutor({});

  const refetch = useQueryClient((state) => state.refetch);
  const queryKeyLoadAllPatientTutor = useLoadAllPatientTutorKEY();
  const queryKeyLoadSchedulePatients = useLoadSchedulesPatientsKEY();

  async function hanldeOnSuccess(param) {
    await assignutor.mutateAsync({
      ...param,
      patient: id,
    });

    await setMainTutor.mutateAsync({
      holder: param.holder,
      patient: id,
    });

    await refetch(queryKeyLoadSchedulePatients);

    await refetch(queryKeyLoadAllPatientTutor);

    createToast({
      message: "Tutor vinculado com sucesso!",
      status: "success",
    });

    setModal(false);
  }

  if (isLoading) {
    return <LoaderCircle size={30} />;
  }

  return (
    <FormHandler
      isStickyButtons
      onSucess={hanldeOnSuccess}
      button={{ text: "Vincular" }}
      customAction={
        {
          props: { refetch: mutate, setInitialHolder, origin },
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
                item?.name + " / " + item?.document + " / " + item?.cellphone,
              value: item.id || "",
            })) || []
          }
        />
      </div>
    </FormHandler>
  );
}
