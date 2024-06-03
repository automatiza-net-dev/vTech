import React from "react";
import { useRouter } from "next/router";

import { notification } from "antd";
import { Button } from "@/OLD/components/mini-components";

import { Container } from "./styles";
import ConfirmScreen from "@/OLD/components/mini-components/ConfirmScreen";

import { unitsService } from "@/OLD/services/units.service";


const verifyErrors = (msg) => {
  if (msg?.includes("Campo não existe nos registros")) {
    return notification.warning({ message: "Verifique o e-mail infomado" });
  }

  return notification.error({
    message: "Houve um erro ao encaminhar o e-mail para redefinição se senha",
  });
};

export function ForgotPassword() {
  const [email, setEmail] = React.useState("");
  const [send, setSend] = React.useState(false);


  const router = useRouter();

  const handleSubmit = React.useCallback(
    (e) => {
      e.preventDefault();
      if (email === "") {
        notification.error({
          message: "Erro",
          description: "Preencha o campo de email",
        });
        return;
      }

      unitsService
        .forgotPassword({ email, systemName: process.env.clientName })
        .then((_res) => {
          setSend(true);
          return notification.success({
            message:
              "E-mail encaminhado com sucesso!, verifique sua caixa de entrada para mais instruções",
          });
        })
        .catch((err) => {
          verifyErrors(
            err?.response?.data?.errors[0]?.message ||
              err?.response?.data?.message
          );
        })
    },
    [email]
  );

  return (
    <Container className="uk-padding-large">
      <img src="/svg/fish_bowl.svg" width="50%" />
      <div className="form-side">
        <img
          width="20%"
          src={
            process.env.NEXT_PUBLIC_API + `/assets/logo-${process.env.client}.png`
          }
        />
        {!send ? (
          <>
            <h3>Solicitar restauração de senha</h3>
            <div className="uk-card uk-card-default uk-card-body uk-width-1-1 border-radius">
              <form onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor="email">Email para restauração de senha</label>
                <input
                  id="email"
                  type="email"
                  className="uk-input uk-margin-bottom"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit">Enviar email</Button>
              </form>
            </div>
          </>
        ) : (
          <ConfirmScreen
            title={"Solicitação encaminhada"}
            description={
              "Em instantes você irá receber instruções por email para redefinição de senha."
            }
          />
        )}
        <div className="uk-margin-top">
          <span className="uk-link" onClick={() => router.push("/")}>
            Voltar
          </span>
        </div>
      </div>
    </Container>
  );
}
