import React, { useState, useCallback } from "react";

import { useRouter } from "next/router";

import { Input, notification } from "antd";

import api from "@/OLD/services";

import masks from "@/OLD/utils/masks";
import { useToast, Button } from "infinity-forge";

export default function NewUser() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    name?: string;
    password?: string;
    password_confirmation?: string;
    phone?: string;
  }>({});

  const router = useRouter();

  const { createToast } = useToast();

  const acceptInvite = useCallback(async () => {
    setLoading(true);
    await api
      .post("/invites/accept-invite-new-user", {
        id: router.query.subpage,
        name: data?.name,
        password: data?.password,
        password_confirmation: data?.password_confirmation,
        phone: masks.noPhone(data.phone),
      })
      .then((_res) => {
        setLoading(false);
        router.push("/");
        return createToast({
          message: "Convite aceito com sucesso!",
          status: "success",
        });
      })
      .catch((err) => {
        setLoading(false);
        if (data.password !== data.password_confirmation) {
          return notification.error({
            message: "Senhas não batem",
          });
        }

        if (err?.response?.data?.message) {
          return createToast({
            message: err?.response?.data?.message?.split(":")[1],
            status: "error",
          });
        }

        return createToast({
          message: "Houve um erro ao aceitar o convite",
          status: "error",
        });
      });
  }, [data, router.query.subpage]);

  return (
    <section
      className="custom-margin-top"
      style={{ marginLeft: "50px", width: "80%" }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          acceptInvite();
        }}
      >
        <section className="header-section">
          <h2>Olá, bem vindo ao sistema {process.env.clientName}</h2>
          <br />
          Para Aceitar o convite preencha os dados abaixo e clique em confirmar:{" "}
        </section>

        <div>
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
              onChange={(e) =>
                setData({ ...data, phone: masks.phone(e.target.value) })
              }
              value={data.phone}
              required
            />
          </div>
          <div className="pass-container">
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
          </div>

          <Button text="Confirmar" type="submit" loading={loading} />
        </div>
      </form>
    </section>
  );
}
