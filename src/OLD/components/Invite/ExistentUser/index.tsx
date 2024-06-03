// @ts-nocheck
import React, { memo, useCallback, useState } from "react";

import { useRouter } from "next/router";
import { useSingleUser } from "@/OLD/hooks/useUser";
import { useSingleInvite } from "@/OLD/hooks/useInvites";
import { useSingleClinic } from "@/OLD/hooks/useClinics";

import { clinicService } from "@/OLD/services/clinic.service";

import { Input, notification } from "antd";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";

const ExistentUser = memo(function ExistentUser() {
  const [password, setPassword] = useState("");

  const router = useRouter();

  const { invite } = useSingleInvite(router.query.subpage);
  const { clinic } = useSingleClinic(invite?.business_unit_id);
  const { user } = useSingleUser(invite?.user_id);

  const acceptInvite = useCallback(() => {
    let err = false;
    clinicService
      .acceptInvite({ idd: router.query.subpage })
      .then((_res) =>
        notification.success({
          message: "Convite aceito com sucesso!",
        })
      )
      .catch((_err) => {
        err = true;
        return notification.error({
          message:
            "Houve um erro ao aceitar o convite, verifique se o convite ainda é válido",
        });
      })
      .finally(() => {
        if (!err) {
          router.push("/");
        }
      });
  }, [router?.query?.subpage, password]);

  return (
    <section className="uk-width-2-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          acceptInvite();
        }}
      >
        <div>
          <h3>
            Olá <strong>{user?.name}</strong>, você já é usuário em nosso
            sistema Vetech!
          </h3>
          <h3>
            Para aceitar ao convite para ser colaborador na clinica:&nbsp;
            <strong>{clinic?.fantasy_name}</strong>, informe sua senha e clique
            em aceitar
          </h3>
        </div>
        <div className="uk-flex uk-flex-column uk-flex-middle">
          <div className="uk-width-1-2">
            <label>Senha</label>
            <Input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </div>
          <CustomButton classCallback="uk-margin-top" type="submit">
            Aceitar
          </CustomButton>
        </div>
      </form>
    </section>
  );
});

export default ExistentUser;
