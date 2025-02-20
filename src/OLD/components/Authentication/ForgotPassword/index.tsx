import React from "react";
import { useRouter } from "next/router";

import { Button, useToast } from "infinity-forge";

import { Container } from "./styles";
import ConfirmScreen from "@/OLD/components/mini-components/ConfirmScreen";

import { unitsService } from "@/OLD/services/units.service";

export function ForgotPassword() {
  const [email, setEmail] = React.useState("");
  const [send, setSend] = React.useState(false);

  const router = useRouter();

  const { createToast } = useToast();

  const handleSubmit = React.useCallback(
    (e) => {
      e.preventDefault();
      if (email === "") {
        createToast({ status: "error", message: "Preencha o campo de email" });

        return;
      }

      unitsService
        .forgotPassword({ email, systemName: process.env.clientName })
        .then((_res) => {
          setSend(true);

          createToast({
            status: "success",
            message:
              "E-mail encaminhado com sucesso!, verifique sua caixa de entrada para mais instruções",
          });
        })
        .catch((err) => {
          const msg =
            err?.response?.data?.errors[0]?.message ||
            err?.response?.data?.message;

          if (msg?.includes("Campo não existe nos registros")) {
            createToast({
              status: "error",
              message: "Verifique o e-mail infomado",
            });

            return;
          }

          createToast({
            status: "error",
            message:
              "Houve um erro ao encaminhar o e-mail para redefinição se senha",
          });
        });
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
            process.env.NEXT_PUBLIC_API +
            `/assets/logo-${process.env.client}.png`
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
                <Button type="submit" text="Enviar e-mail" />
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
