import React, { useCallback, useEffect, useState } from "react";

import Link from "next/link";

import { notification } from "antd";
import { useAuthAdmin } from "infinity-forge";

import { Button } from "@/OLD/components/mini-components";
import { sessionService } from "@/OLD/services/session.service";

import { Storage } from "infinity-forge";
import{container, TypesAutomatiza} from "@/container"

import { Container } from "./styles";

export function SignIn() {
  const [data, setData] = useState({
    email: "",
    password: "",
    ipAddress: "",
  });
  const [saveAccess, setSaveAccess] = useState(false);

  const {loadUser} = useAuthAdmin()

  useEffect(() => {
    fetch("https://api.ipify.org/")
      .then((res) => res.text())
      .then((res) => {
        setData((prev) => ({ ...prev, ipAddress: res }));
      });
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
        const getBusinessUnits = await sessionService.login({ ...data, system: process.env.clientName });
        const loginResponse = await sessionService.login({ ...data, system: process.env.clientName, business_unit_id : getBusinessUnits.data[0].businessUnits[0].id });

        await container.get<Storage>(TypesAutomatiza.storage).set('token', { value: loginResponse.data.token });

        loadUser()

      } catch (err: any) {
        notification.error({
          message: "Erro",
          description:
            err?.response?.status === 422
              ? "Usuário ou senha não existe"
              : "Erro ao logar. Por favor, tente novamente mais tarde.",
        });
      }
    },
    [data]
  );


  return <Container>
        <img
          className="uk-margin-xlarge-right"
          src={
            process.env.client === "sancla"
              ? "/img/Imagem_Logo_Gato.png"
              : "/img/lo-logo-green.png"
          }
          width="500"
        />
        <div className="left-side">
          <div className="uk-card uk-card-default uk-card-body uk-width-1-1 border-radius">
            <form onSubmit={(e) => handleSubmit(e)}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="uk-input uk-margin-bottom"
                required
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />

              <label htmlFor="password">Senha</label>
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
                      className="uk-radio"
                      checked={saveAccess}
                      onClick={() => setSaveAccess(!saveAccess)}
                    />
                    <label htmlFor="save-access">Permanecer logado </label>
                  </div>
                  <Link href="/senha/esqueci">Esqueci minha senha</Link>
                </div>

                <Button type="submit">Entrar</Button>

                <div style={{ textAlign: "center", marginTop: "10px" }}>
                  <Link href="/admin">Área do franqueador</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Container>

}