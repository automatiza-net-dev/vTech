import { useState } from "react";

import { Modal } from "infinity-forge";

import { useLoadPatient } from "@/presentation";
import { DosesModal } from "@/OLD/components/Attendance/Timeline/LaunchedVaccinesList/DosesModal";

import * as S from "./styles";

export function NameVaccine(props) {
  const [modal, setModal] = useState(false);

  const { data } = useLoadPatient();

  return (
    <S.NameVaccine>
      <Modal
        modal={modal}
        setModal={setModal}
        trigger={undefined}
        style={{ maxWidth: "700px", padding: 30 }}
      >
        <DosesModal
          modal={true}
          visible={modal}
          setVisible={setModal}
          patient={data}
          TabVacinaItem={props}
          
        />
      </Modal>

      {props?.vaccine.name && (
        <span className="modal-link" onClick={() => setModal(true)}>
          {props.vaccine.name}
        </span>
      )}
    </S.NameVaccine>
  );
}
