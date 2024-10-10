import React from "react";

import { useRouter } from "next/router";

import { notification } from "antd";
import { Button, FormHandler, Input, InputMask } from "infinity-forge";

import api from "@/OLD/services";
import { step02Schema } from "./schema";
import { SelectUF, SelectCity } from "@/presentation";

import * as S from "./styles";

export function Step2(props) {
  const router = useRouter();

  async function sendToken(formData) {
    try {
      await api?.post("/users/send-confirmation", {
        email: props?.data?.email,
        ...formData,
      });
    } catch (err: any) {
      err?.response?.data?.errors?.forEach((error) => {
        if (error?.message.includes("Campo já está em uso")) {
          notification.error({
            message:
              "Email já em uso, faça login ou verifique o e-mail informado",
          });
          props.setStep(1);
        }
      });
      return;
    }
  }

  async function handleSubmit(formData) {
    try {
      await sendToken(formData);

      props.setData({
        ...props.data,
        ...formData,
      });
      props.setStep(3);
    } catch (error) {
      notification.error({
        message: "Erro",
        description: "Por favor, preencha todos os campos corretamente",
      });
    }
  }

  return (
    <S.Step2>
      <h3 style={{ color: "#ffffff" }}>
        Olá <strong>{props?.data?.email}</strong>, nos conte um pouco mais sobre
        você.
      </h3>

      <h4 className="uk-margin-remove" style={{ color: "#ffffff" }}>
        Estas informações serão usadas para entrarmos em contato.
      </h4>

      <FormHandler
        disableEnterKeySubmitForm
        onSucess={handleSubmit}
        button={{ text: "Próximo" }}
        schema={step02Schema}
        customAction={{
          Component: () => (
            <Button
              onClick={() => props.setStep((prev) => prev - 1)}
              text="Voltar"
            />
          ),
        }}
      >
        <Input label="Nome" name="name" minLength={2} required type="text" />

        <InputMask
          mask="(__) _____-____"
          label="Telefone"
          name="phone"
          required
        />

        <SelectUF />

        <SelectCity />
      </FormHandler>

      <span className="uk-link font-12" onClick={() => router.push("/")}>
        Já possuo conta
      </span>
    </S.Step2>
  );
}
