import { useEffect } from "react";
import { useFormikContext } from "formik";
import { InputMask } from "infinity-forge";

import { RemoteTutor } from "@/data";
import { container, patientTypes } from "@/container";

export function InputPhone() {
  const { setFieldError, values } = useFormikContext<any>();

  useEffect(() => {
    const cellphone = values["cellphone"].replace(/\D/g, "") as string;

    if (cellphone?.length === 11) {
      (async () => {
        const response = await container.get<RemoteTutor>(patientTypes.RemoteTutor).setPhone({ phone: cellphone });

        if (response.cellphone) {
          setFieldError("cellphone", "Telefone já existe na base de dados.");
        } else {
          setFieldError("cellphone", "");
        }
      })();
    }
  }, [values]);

  return (
    <InputMask
      name="cellphone"
      label="Telefone"
      placeholder="Telefone"
      mask="(__) 9 ____-____"
    />
  );
}
