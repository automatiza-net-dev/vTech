import { useState } from "react";

import { Modal, useLoadPatient } from "@/presentation";
import { DosesModal } from "@/OLD/components/Attendance/Timeline/LaunchedVaccinesList/DosesModal";

import * as S from "./styles";

export function NameVaccine(props) {
  const [modal, setModal] = useState(false);

  const { data } = useLoadPatient();

  // TODO tipar retorno de vacina - Jorge

  return (
    <S.NameVaccine>
      <DosesModal
        visible={modal}
        setVisible={setModal}
        patient={data}
        vaccine={props}
      />

      {props?.vaccine.name && (
        <span className="modal-link" onClick={() => setModal(true)}>
          {props.vaccine.name}
        </span>
      )}
    </S.NameVaccine>
  );
}
