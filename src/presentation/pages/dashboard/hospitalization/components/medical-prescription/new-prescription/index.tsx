import { useState } from "react";

import { Button, Modal } from "infinity-forge";
import { FormCreatePrescription } from "./form-create-prescription";

import * as S from "./styles";

export function NewPrescription({ hospitalizationId }) {
  const [open, setOpen] = useState(false);
  const [previousPrescription, setPreviousPrescription] = useState(null);

  return (
    <S.NewPrescription>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        styles={{ maxWidth: "1300px", width: "95%" }}
      >
        <FormCreatePrescription
          previousPrescription={previousPrescription}
          hospitalizationId={hospitalizationId}
          onCreate={(data) => {
            setOpen(false);
            setPreviousPrescription(data);
          }}
        />
      </Modal>

      <Button
        type="button"
        onClick={() => setOpen(true)}
        text="Nova prescrição"
      />
    </S.NewPrescription>
  );
}
