import React, { useState } from "react";
import { useRouter } from "next/router";
import { notification } from "antd";

import { Button } from "infinity-forge";
import { userService } from "@/OLD/services/user.service";
import ConfirmScreen from "@/OLD/components/mini-components/ConfirmScreen";

import { Container } from "./styles";

const verifyErrors = (msg) => {
  if (msg?.includes("Token inválido")) {
    return notification.error({ message: "Token inválido, solicite um novo." });
  }

  return notification.error({
    message: "Houve um erro ao criar a nova senha...",
  });
};

export function ResetPassword({ type = "reset" }) {
  const [send, setSend] = useState(false);
  const [data, setData] = React.useState({
    password: "",
    password_confirmation: "",
  });

  const router = useRouter();

  const hash = router?.query.token;

  const handleSubmit = React.useCallback(
    (e) => {
      e.preventDefault();
      if (data.password === "" || data.password_confirmation === "") {
        notification.error({
          message: "Erro",
          description: "Preencha os dois campos",
        });
        return;
      }

      if (data.password !== data?.password_confirmation) {
        notification.error({
          message: "Erro",
          description: "As senhas não conferem",
        });
        return;
      }

      type === "reset"
        ? userService
            .resetPassword({ ...data, hash })
            .then((_res) => {
              setSend(true);
              return notification.success({ message: "Senha alterada!" });
            })
            .catch((err) => {
              verifyErrors(err?.response?.data?.message);
            })
        : userService
            .changePassword({ ...data, hash })
            .then((_res) => {
              setSend(true);
              return notification.success({ message: "Senha alterada!" });
            })
            .catch((err) => {
              verifyErrors(err?.response?.data?.message);
            });
    },
    [data]
  );

  return (
    <Container className="uk-padding-large">
      <img src="/svg/dog_walking.svg" width="60%" />
      <div className="form-side">
        <img
          src={
            process.env.NEXT_PUBLIC_API +
            `/assets/logo-${process.env.client}.png`
          }
        />
        {!send ? (
          <>
            <h3>Crie uma senha nova</h3>
            <div className="uk-card uk-card-default uk-card-body uk-width-1-1 border-radius">
              <form onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor="password">Nova senha</label>
                <input
                  value={data?.password}
                  id="password"
                  type="password"
                  className="uk-input uk-margin-bottom"
                  required
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                />
                <label htmlFor="passwordConfirmation">
                  Confirmação da senha nova senha
                </label>
                <input
                  value={data?.password_confirmation}
                  id="passwordConfirmation"
                  type="password"
                  className="uk-input uk-margin-bottom"
                  required
                  onChange={(e) =>
                    setData({ ...data, password_confirmation: e.target.value })
                  }
                />
                <Button type="submit" text="Alterar" />
              </form>
            </div>
          </>
        ) : (
          <ConfirmScreen
            title={"Senha criada!"}
            description={"Você já pode acessar a plataforma com a nova senha"}
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
