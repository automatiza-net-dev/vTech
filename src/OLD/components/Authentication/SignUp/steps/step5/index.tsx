import React, { useCallback, useState } from "react";

import { notification } from "antd";
import { useAuthAdmin, Button } from "infinity-forge";

import api from "@/OLD/services";

export const signUpUser = [
  {
    label: "Senha",
    id: "password",
    type: "password",
  },
  {
    label: "Confirmar senha",
    id: "password_confirmation",
    type: "password",
  },
];

export function Step5(props) {
  const [data, setData] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    password_confirmation?: string;
  }>({
    name: props.data.name,
    email: props.data.email,
    phone: props.data.phone.replace(/[^0-9]/g, ""),
  });
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuthAdmin();

  const handleSubmit = useCallback(
    async (e) => {
      let errorCount = 0;
      e.preventDefault();

      Object.keys(data).forEach((key) => {
        if (data[key] === "") {
          errorCount++;
        }
      });

      if (errorCount === 0) {
        if (data.password === data.password_confirmation) {
          setLoading(true);
          try {
            await api.post(`/auth/register`, {
              ...data,
              email: props.data?.email,
              systemName: process.env.clientName,
            });

            await signIn({
              emailAddress: props.data?.email,
              password: data.password || "",
            });

            props.setData({
              ...props.data,
              singnUpForm: data,
              success: true,
            });
            props.setStep((prv) => prv + 1);
          } catch (err: any) {
            notification.error({
              message: "Erro",
              description:
                err?.response?.status === 422
                  ? "Email ou documento já cadastrado"
                  : "Erro ao criar conta",
            });
          }
          setLoading(false);
        } else {
          notification.error({
            message: "Senhas não conferem",
          });
        }
      } else {
        notification.error({
          message: "Por favor, preencha todos os campos",
        });
      }
    },
    [data, props]
  );

  return (
    <div>
      <h3>
        Ótimo! agora para concluir seu cadastro preencha os campos abaixo.
      </h3>
      <form
        className={"uk-flex uk-flex-column"}
        onSubmit={(e) => handleSubmit(e)}
      >
        {signUpUser.map((item) => (
          <div key={item.id} className="uk-flex uk-flex-column">
            <label htmlFor={item.id}>{item.label}</label>
            <input
              className="uk-input uk-width-1-2 uk-margin-bottom"
              type={item.type}
              id={item.id}
              onChange={(e) => setData({ ...data, [item.id]: e.target.value })}
              required={true}
            />
          </div>
        ))}
        <Button text={loading ? "Carregando..." : "Cadastrar"} type="submit" />
      </form>
    </div>
  );
}
