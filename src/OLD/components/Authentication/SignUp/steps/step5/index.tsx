import { api, FormHandler, InputPassword, useToast } from "infinity-forge";

import * as yup from "yup";

import * as S from "./styles"
import { useConfigurationsSystem } from "@/presentation";

export function Step5(props) {

  const { id, name } = useConfigurationsSystem()

  async function handleSubmit(data) {
    const payload = {
      ...props.data,
      ...data,
      systemId: id,
      systemName: name,
      phone: props.data.phone.replace(/[^0-9]/g, ""),
    };

    await api({
      method: "post",
      url: "auth/register",
      body: payload,
    });

    props.setData({
      ...props.data,
      singnUpForm: data,
      success: true,
    });

    props.setStep((prv) => prv + 1);
  }

  return (
    <S.Step5>
      <h3>
        Ótimo! agora para concluir seu cadastro preencha os campos abaixo.
      </h3>

      <FormHandler
        button={{ text: "Cadastrar" }}
        isStickyButtons
        cleanFieldsOnSubmit={false}
        schema={{
          password: yup.string().required("Campo requerido"),
          password_confirmation: yup
          .string()
          .oneOf([yup.ref("password")], "As senhas devem ser iguais")
          .required("Campo requerido"),
        }}
        onSucess={async (data) => {
          handleSubmit(data);
        }}
      >
        <InputPassword name="password" label="Senha" />
        <InputPassword name="password_confirmation" label="Confirmar senha" />
      </FormHandler>
    </S.Step5>
  );
}
