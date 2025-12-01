import { useVerifyFinanceSchedule } from "@/presentation/pages/dashboard/scheduling/utils";
import { FormHandler, Input, InputPassword, Modal } from "infinity-forge";
import { useState } from "react";

export function useModalAuthorization({ event }) {
  const [open, setOpen] = useState(false);
  const [dataSaved, setDataSaved] = useState({
    formData: null,
    callback: (params) => {},
  });

  const { disableFinanceSchedule } = useVerifyFinanceSchedule({ event });

  const ModalAuthorization = (
    <Modal open={open} onClose={() => setOpen(false)}>
      <FormHandler
        isStickyButtons
        button={{ text: "Confirmar" }}
        onSucess={async (data) => {
          const finalPayload = {
            ...data,
            ...(dataSaved?.formData || {}),
          };

          await dataSaved.callback(finalPayload);

          setOpen(false);
        }}
      >
        <Input name="userEmail" type="email" label="Usuário (e-mail)" />

        <InputPassword name="userPwd" label="Senha" />
      </FormHandler>
    </Modal>
  );

  async function executeVerification({ formData, handleSucess }) {
    if (disableFinanceSchedule) {
      setDataSaved({ formData, callback: handleSucess });
      setOpen(true);
    } else {
      await handleSucess(formData);
    }
  }

  return { ModalAuthorization, executeVerification };
}
