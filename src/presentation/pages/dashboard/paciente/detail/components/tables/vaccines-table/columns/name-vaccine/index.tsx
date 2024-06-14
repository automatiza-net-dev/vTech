import { useState } from "react";

import { Modal } from "infinity-forge";

import { useLoadPatient } from "@/presentation";
import { DosesModal } from "@/OLD/components/Attendance/Timeline/LaunchedVaccinesList/DosesModal";

import * as S from "./styles";

export function NameVaccine(props) {
  const [open, setOpen] = useState(false);

  const { data } = useLoadPatient();

  return (
    <S.NameVaccine>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        styles={{ maxWidth: "700px", padding: 30 }}
      >
        <DosesModal
          modal={true}
          visible={open}
          setVisible={setOpen}
          patient={data}
          TabVacinaItem={props}
          
        />
      </Modal>

      {props?.vaccine.name && (
        <span className="modal-link" onClick={() => setOpen(true)}>
          {props.vaccine.name}
        </span>
      )}
    </S.NameVaccine>
  );
}
