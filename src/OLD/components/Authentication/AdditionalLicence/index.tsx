import React from "react";

import { notification } from "antd";
import { Button, LoadingSpin } from "@/OLD/components/mini-components";
import { Container } from "../ForgotPassword/styles";
import { userService } from "@/OLD/services/user.service";
import { useRouter } from "next/router";


export function AdditionalLicence() {
  const router = useRouter();
  const [loading, setLoadig] = React.useState(false);

  const handleAddLicence = React.useCallback(() => {
    setLoadig(true);
    userService
      .addLicence()
      .then((res) => {
        setLoadig(false);
        notification.success({
          message: "Sucesso!",
          description: "Licença adicional efetuada!",
        });

        router.push("/");
      })
      .catch(() => {
        setLoadig(false);
        notification.error({
          message: "Erro",
          description: "Erro ao adicionar licença",
        });
      });
  }, []);

  return (
    <Container className="uk-padding-large">
      <img src="/svg/cautious_dog.svg" width="60%" />
      <div className="form-side">
        <img
          src={process.env.NEXT_PUBLIC_API + `/assets/logo-${process.env.client}.png`}
        />
        <h4 style={{ textAlign: "center" }}>
          Sua licença de teste expirou. Deseja adicionar uma licença adicional?
        </h4>
        <Button onClick={handleAddLicence}>
          {loading ? <LoadingSpin /> : "Adicionar licença"}
        </Button>
      </div>
    </Container>
  );
}
