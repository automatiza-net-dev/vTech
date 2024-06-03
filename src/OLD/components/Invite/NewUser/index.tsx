import React, { memo, useState, useCallback } from "react";

import { useRouter } from "next/router";

import { Input, notification } from "antd";

import api from "@/OLD/services";
import { Button } from "@/OLD/components/mini-components/Button";

export default function NewUser() {
  const [data, setData] = useState<{
    name?: string;
    password?: string;
    password_confirmation?: string;
    phone?: string;
  }>({});

  const router = useRouter();

  const acceptInvite = useCallback(async () => {
    await api
      .post("/invites/accept-invite-new-user", {
        id: router.query.subpage,
        name: data?.name,
        password: data?.password,
        password_confirmation: data?.password_confirmation,
      })
      .then((_res) => {
        notification.success({ message: "Convite aceito com sucesso!" });
        return router.push("/");
      })
      .catch((err) => {
        if (err?.response?.data?.errors[0]?.rule === "confirmed") {
          return notification.error({
            message: "Senhas não batem",
          });
        }
      });
  }, [data, router.query.subpage]);

  return (
    <section className="uk-width-3-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          acceptInvite();
        }}
      >
        <h3>
          Olá, bem vindo ao sistema Vetech.
          <br />
          Para Aceitar o convite preencha os dados abaixo e clique em confirmar:{" "}
        </h3>
        <div className="uk-width-1-2">
          <div className="uk-margin-small-top">
            <label>Nome</label>
            <Input
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
            />
          </div>
          <div className="uk-margin-small-top">
            <label>Telefone</label>
            <Input
              onChange={(e) => setData({ ...data, phone: e.target.value })}
              required
            />
          </div>
          <div className="uk-margin-small-top">
            <label>Senha</label>
            <Input
              type="password"
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
            />
          </div>
          <div className="uk-margin-small-top">
            <label>Confirmar senha</label>
            <Input
              type="password"
              onChange={(e) =>
                setData({ ...data, password_confirmation: e.target.value })
              }
              required
            />
          </div>
          <div className="uk-margin-top uk-flex uk-flex-center">
            <Button type="submit">Confirmar</Button>
          </div>
        </div>
      </form>
    </section>
  );
}
