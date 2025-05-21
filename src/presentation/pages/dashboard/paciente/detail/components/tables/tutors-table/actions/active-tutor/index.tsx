import { useState } from "react";

import {
  useQueryClient,
  LoaderCircle,
  useToast,
  Tooltip,
} from "infinity-forge";

import { Tutor } from "@/domain";
import { useLoadPatient, useSetMainTutor } from "@/presentation";

import * as S from "./styles";

export function ActiveTutor(props: Tutor) {
  const [loading, setLoading] = useState(false);

  const patient = useLoadPatient();
  const { createToast } = useToast();
  const setMainTutor = useSetMainTutor();

  const refetch = useQueryClient((st) => st.refetch);

  const patientId = patient.data?.id;
  const isTutorActive = patient?.data?.tutor?.id === props.id;

  async function handleSuccess() {
    if (isTutorActive) {
      createToast({ message: "Tutor já vinculado", status: "error" });

      return;
    }

    setLoading(true);

    await setMainTutor.mutateAsync({
      patient: patientId || "",
      holder: props?.id,
    });

    createToast({ message: "Tutor vinculado com sucesso!", status: "success" });

    await refetch(["RemotePatient", patientId]);
    await refetch(["LastUpdates", patientId]);

    setLoading(false);
  }

  return (
    <S.ActiveTutor>
      <Tooltip
        idTooltip="ActiveTutor"
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
