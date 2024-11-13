// @ts-nocheck
import { Input } from "antd";
import { AxiosError } from "axios";
import React, { memo, useCallback, useState } from "react";

import { clinicService } from "@/OLD/services/clinic.service";

import { useToast, Button } from "infinity-forge";
import { Container } from "../styles";

const ExistentUser = memo(function ExistentUser(props) {
  const [password, setPassword] = useState("");

  const { createToast } = useToast();

  async function acceptInvite() {
    try {
      await clinicService.acceptInvite({ id: props?.id });

      createToast({
        message: "Convite aceito com sucesso!",
        status: "success",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        return createToast({
          message: error?.response?.data?.message,
          status: "error",
        });
      }
    }
  }

  return (
    <section style={{ marginLeft: "50px", width: "80%" }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          acceptInvite();
        }}
      >
        <div className="header-section custom-margin-top">
          <h2>
            Ola {props.email}, bem vindo ao sistema de gestão{" "}
            {process.env.clientName}.
          </h2>
          <h2>
            Você recebeu um convite de {props?.invitedBy?.name} para ter acesso
            à unidade "{props?.businessUnit?.identification}". <br />
          </h2>

          <p style={{ marginTop: 20 }}>
            Para aceitar o convite, digite a sua senha de acesso ao sistema e
            clique no botão Aceitar.
          </p>
        </div>

        <div>
          <label>Senha</label>
          <Input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </div>
        <Button text="Aceitar" type="submit" />
      </form>
    </section>
  );
});

export default ExistentUser;
