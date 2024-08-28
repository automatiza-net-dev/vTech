import { useState } from "react";
import { useFormikContext } from "formik";

import { useLoadGoal } from "@/presentation/hooks";

import * as S from "./styles";
import { Button, Modal } from "infinity-forge";

export function CopyPastMonth({ period }: { period: string }) {
  const [confirmAction, setConfirmAction] = useState(false);

  const { data } = useLoadGoal(period);
  const { setFieldValue } = useFormikContext();

  function copyDataFromPastMonth() {
    if (data && data[0] && data[0].metas) {
      const previousMetas = data[0].metas;
      previousMetas.forEach((meta, index) => {
        const fieldName = `items[${index}].value`;
        setFieldValue(fieldName, meta.value || "0");
      });
    }
  }

  function closeConfirmation() {
    setConfirmAction(false);
  }

  function confirmConfirmation() {
    copyDataFromPastMonth();
    setConfirmAction(false);
  }

  if (!data) {
    return <></>;
  }

  return (
    <>
      <S.CopyPastMonth type="button" onClick={() => setConfirmAction(true)}>
        Copiar Meta do mes anterior
      </S.CopyPastMonth>

      <Modal open={confirmAction} onClose={closeConfirmation}>
        <S.ConfirmModal>
          <h4>Copiar metas do mês/ano anterior?</h4>

          <div className="buttons">
            <Button
              type="button"
              onClick={confirmConfirmation}
              text="Confirmar"
            />

            <Button type="button" onClick={closeConfirmation} text="Sair" />
          </div>
        </S.ConfirmModal>
      </Modal>
    </>
  );
}
