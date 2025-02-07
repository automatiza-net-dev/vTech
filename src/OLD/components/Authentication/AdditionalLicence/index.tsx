import React from "react";

import { notification } from "antd";
import { Button, useToast } from "infinity-forge";
import { useRouter } from "next/router";
import { Container } from "../ForgotPassword/styles";
import { userService } from "@/OLD/services/user.service";

export function AdditionalLicence() {
  const router = useRouter();
  const [loading, setLoadig] = React.useState(false);

  const {createToast} = useToast()

  const handleAddLicence = React.useCallback(() => {
    setLoadig(true);
    userService
      .addLicence()
      .then((res) => {
        setLoadig(false);
        createToast({ status: "success", message: "Licença adicional efetuada!", })

        router.push("/");
      })
      .catch(() => {
        setLoadig(false);
        createToast({ status: "error", message: "Erro ao adicionar licença", })
      });
  }, []);

  return (
    <Container className="uk-padding-large">
      <img src="/svg/cautious_dog.svg" width="60%" />
      <div className="form-side">
        <img
          src={
            process.env.NEXT_PUBLIC_API +
            `/assets/logo-${process.env.client}.png`
          }
        />
        <h4 style={{ textAlign: "center" }}>
          Sua licença de teste expirou. Deseja adicionar uma licença adicional?
        </h4>
        <Button
          onClick={handleAddLicence}
          text={loading ? "Carregando..." : "Adicionar licença"}
        />
      </div>
    </Container>
  );
}
