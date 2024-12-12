import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

import { container, TypesAutomatiza } from "@/container";

import moment from "moment";
import { notification } from "antd";
import { useAuthAdmin, Button } from "infinity-forge";

import { sessionService } from "@/OLD/services/session.service";

import { Storage } from "@/infra";

import { Container } from "./styles";

export function SignIn() {
  const [data, setData] = useState({
    email: "",
    password: "",
    ip: "",
  });
  const [saveAccess, setSaveAccess] = useState(false);
  const { loadUser } = useAuthAdmin();

  const router = useRouter();

  useEffect(() => {
    if (process.browser) {
      async () => {
        const storage = container.get<Storage>(TypesAutomatiza.storage);
        const ipStorage = await storage.get<"ip">("ip");
        const ip = ipStorage?.value;
        if (ip) {
          setData((prev) => ({ ...prev, ip }));
        }
      };
    }
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (data.email === "" || data.password === "") {
        return notification.error({
          message: "Erro",
          description: "Por favor, preencha todos os campos",
        });
      }

      try {
        const getBusinessUnits = await sessionService.login({
          ...data,
          system: process.env.clientName,
        });

        const loginResponse =
          Array.isArray(getBusinessUnits.data) &&
          getBusinessUnits.data[0].businessUnits &&
          ((await sessionService.login({
            ...data,
            system: process.env.clientName,
            business_unit_id: getBusinessUnits.data[0].businessUnits[0].id,
          })) as any);

        await container.get<Storage>(TypesAutomatiza.storage).set("token", {
          value: getBusinessUnits?.data?.token || loginResponse?.data?.token,
        });

        if (loginResponse?.message) {
          return notification.error({
            message: "Erro",
            description: loginResponse.message,
          });
        }

        router.push(
          `/dashboard?fromDate=${moment().format(
            "YYYY-MM-DD"
          )}&toDate=${moment().format("YYYY-MM-DD")}`
        );
        loadUser();
      } catch (err: any) {
        notification.error({
          message: "Erro",
          description:
            err?.response?.data?.message ||
            (err?.response?.status === 422
              ? "Usuário ou senha não existe"
              : "Erro ao logar. Por favor, tente novamente mais tarde."),
        });
      }
    },
    [data]
  );

  return (
    <Container>
      <img
        className="uk-margin-xlarge-right"
        src={
          process.env.client === "sancla"
            ? "/img/Imagem_Logo_Gato.png"
            : process.env.client === "clinicas"
            ? "/img/clinicas_temp.png"
            : "/img/lo-logo-green.png"
        }
        width="500"
      />
      <div className="left-side">
        <div className="uk-card uk-card-default uk-card-body uk-width-1-1 border-radius">
          <form onSubmit={(e) => handleSubmit(e)}>
            <span style={{ fontSize: "16px" }}>Email</span>
            <input
              id="email"
              type="email"
              className="uk-input uk-margin-bottom"
              required
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />

            <span style={{ fontSize: "16px" }}>Senha</span>
            <input
              id="password"
              type="password"
              className="uk-input uk-margin-bottom"
              required
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <div className="uk-flex uk-flex-column">
              <div className="uk-margin-bottom uk-flex uk-flex-between">
                <div className="checkbox">
                  <input
                    id="save-access"
                    type="radio"
                    className="uk-radio uk-margin-small-right"
                    checked={saveAccess}
                    onClick={() => setSaveAccess(!saveAccess)}
                  />
                  <span style={{ fontSize: "14px" }}>Permanecer logado </span>
                </div>
                <Link href="/senha/esqueci">Esqueci minha senha</Link>
              </div>

              <Button
                type="submit"
                text="Entrar"
                style={{ width: "100%", borderRadius: "25px" }}
              />

              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <Link href="/admin">Área do franqueador</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
}
