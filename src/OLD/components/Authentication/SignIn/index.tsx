import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

import { useAuthAdmin, Button, useToast, api, cookies } from "infinity-forge";

import { sessionService } from "@/OLD/services/session.service";

import { Container } from "./styles";

export function SignIn() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    ip: "",
  });
  const [saveAccess, setSaveAccess] = useState(false);

  const { createToast } = useToast();
  const { loadUser } = useAuthAdmin();

  useEffect(() => {
    if (process.browser) {
      (async () => {
        const ip = await api({ url: "ip", method: "get" }, "/api/");

        if (ip) {
          setData((prev) => ({ ...prev, ip }));
        }
      })();
    }
  }, []);


  const handleSubmit = useCallback(
    async (e) => {
      setLoading(true)
      e.preventDefault();

      if (data.email === "" || data.password === "") {
        createToast({
          status: "error",
          message: "Por favor, preencha todos os campos",
        });
        return;
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

        await cookies.set("token", {
          value: getBusinessUnits?.data?.token || loginResponse?.data?.token,
        });

        if (loginResponse?.message) {
          return createToast({
            status: "error",
            message: loginResponse.message,
          });
        }

        await loadUser({ roleName: "user" });
      } catch (err: any) {
   
        createToast({
          status: "error",
          duration: 7500,
          message:
            err?.response?.data?.message || "Erro ao logar. Por favor, tente novamente mais tarde.",
        });
      }finally {
        setLoading(false)
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
                loading={loading}
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
