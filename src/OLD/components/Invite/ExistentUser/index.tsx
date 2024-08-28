// @ts-nocheck
import React, { memo, useCallback, useState } from "react";

import { useRouter } from "next/router";
import { useSingleUser } from "@/OLD/hooks/useUser";
import { useSingleInvite } from "@/OLD/hooks/useInvites";
import { useSingleClinic } from "@/OLD/hooks/useClinics";

import { clinicService } from "@/OLD/services/clinic.service";

import { Input } from "antd";
import { useToast, Button } from "infinity-forge";
import { Container } from "../styles";

const ExistentUser = memo(function ExistentUser() {
  const [password, setPassword] = useState("");

  const router = useRouter();

  const { createToast } = useToast();
  const { invite } = useSingleInvite(router.query.subpage);

  const { user } = useSingleUser(invite?.user_id);
  const { clinic } = useSingleClinic(invite?.business_unit_id);

  const acceptInvite = useCallback(() => {
    clinicService
      .acceptInvite({ id: router.query.subpage })
      .then((_res) =>
        createToast({
          message: "Convite aceito com sucesso!",
          status: "success",
        })
      )
      .catch((err) => {
        router.push("/");
        if (
          err?.response?.data?.code &&
          err?.response?.data?.code === "E_BAD_REQUEST"
        ) {
          return createToast({
            message: err?.response?.data?.message.split(":")[1],
            status: "error",
          });
        }

        return createToast({
          message:
            "Houve um erro ao aceitar o convite, verifique se o convite ainda é válido",
          status: "error",
        });
      });
  }, [router?.query?.subpage, password]);

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
            Olá <strong>{user?.name}</strong>, você já é usuário em nosso
            sistema Vetech!
          </h2>
          <p className="custom-margin-top">
            Para aceitar ao convite para ser colaborador na clinica:&nbsp;
            <strong>{clinic?.fantasy_name}</strong>, informe sua senha e clique
            em aceitar
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
