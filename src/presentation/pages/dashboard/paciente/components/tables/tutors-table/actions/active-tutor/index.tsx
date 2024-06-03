import { useState } from "react";

import { Popup } from "semantic-ui-react";
import { useQueryClient } from "react-query";
import { LoaderCircle, useToast } from "infinity-forge";

import {
  useLoadPatient,
  useSetMainTutor,
} from "@/presentation";
import { Patient, Tutor } from "@/domain";

import * as S from "./styles";

export function ActiveTutor(props: Tutor) {
  const [loading, setLoading] = useState(false);

  const patient = useLoadPatient();
  const { toast } = useToast();
  const setMainTutor = useSetMainTutor();

  const queryClient = useQueryClient();

  const patientId = patient.data?.id;
  const isTutorActive = patient.data?.tutor.id === props.id;

  async function handleSuccess() {
    if (isTutorActive) {
      toast.error("Tutor já vinculado", {
        autoClose: 4000,
        position: "top-right",
      });

      return;
    }

    setLoading(true);

    await setMainTutor.mutateAsync({
      patient: patientId || "",
      holder: props?.id,
    });

    toast.success("Tutor vinculado com sucesso!", {
      autoClose: 4000,
      position: "top-right",
    });

    //TODO JORGE PEGAR DAQUI PAR ATUALIZAR O EDITAR.
    queryClient.setQueryData(["RemotePatient", patientId], (state) => {
      const queryData = state as Patient;

      return {
        ...queryData,
        tutor: {
          ...queryData.tutor,
          address: "novo endereço"
        },
      } as Patient;
    });

    setLoading(false);
  }



  return (
    <S.ActiveTutor>
      <Popup
        content="Definir tutor ativo"
        trigger={
          <button
            type="submit"
            onClick={handleSuccess}
            style={{ backgroundColor: isTutorActive ? "#D1F1F1" : "#E1E1E1" }}
          >
            {loading ? (
              <LoaderCircle size={10} color="#000" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5C13.1421 1.5 16.5 4.85786 16.5 9C16.5 13.1421 13.1421 16.5 9 16.5ZM8.25195 12L13.5553 6.6967L12.4946 5.63604L8.25195 9.8787L6.13066 7.75732L5.06999 8.81805L8.25195 12Z"
                  fill={isTutorActive ? "#4BC0C0" : "#828282"}
                />
              </svg>
            )}
          </button>
        }
      />
    </S.ActiveTutor>
  );
}
