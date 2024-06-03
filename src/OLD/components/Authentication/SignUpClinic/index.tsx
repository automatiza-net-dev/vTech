import { useState, useCallback } from "react";

import { useRouter } from "next/router";

import { notification } from "antd";

import api from "@/OLD/services";
import { sessionService } from "@/OLD/services/session.service";
import { Button, LoadingSpin } from "@/OLD/components/mini-components";

export function SignUpClinic() {
  const router = useRouter();
  const [data, setData] = useState<{}>({});
  const [loading, setLoading] = useState(false);


  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      await api
        .post("/invites/accept-invite-new-user", { ...data, id: router?.query?.token }).then((res) => {
          notification.success({
            message: "Sucesso",
            description: "Cadastro realizado com sucesso!",
          });
          setLoading(false);
          sessionService.logout();
          router.push("/");
        })
        .catch((err) => {
          notification.error({
            message: "Erro",
            description: "Erro ao concluir cadastro",
          });
          setLoading(false);
        });
    },
    [data]
  );

  return (
    <div
      className="uk-padding uk-width-1-1 uk-flex"
      style={{
        backgroundColor: "#B5F5EC",
        minHeight: "100vh",
      }}
    >
      <div className="uk-padding">
        <img src="/svg/welcome_cats.svg" alt="Welcome Cats" />
      </div>

      <div className="uk-card uk-card-default uk-card-body uk-width-2-5 uk-border-rounded">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={process.env.NEXT_PUBLIC_API + `/assets/logo-${process.env.client}.png`}
          />
          <h3>Cadastro por convite</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            className="uk-input uk-margin-bottom"
            required
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />

          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            className="uk-input uk-margin-bottom"
            required
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />

          <label htmlFor="confirmPassword">Confirmar senha</label>
          <input
            id="confirmPassword"
            type="password"
            className="uk-input uk-margin-bottom"
            required
            onChange={(e) =>
              setData({ ...data, password_confirmation: e.target.value })
            }
          />
          <Button type="submit">
            {loading ? <LoadingSpin /> : "Cadastrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
