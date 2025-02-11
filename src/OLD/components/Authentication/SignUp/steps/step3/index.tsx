import React, { useState, useEffect, useCallback } from "react";

import { useRouter } from "next/router";

import { Button, useToast } from "infinity-forge";
import { Input } from "antd";

import api from "@/OLD/services";
import { userService } from "@/OLD/services/user.service";

import * as S from "./styles";

export function Step3({ data, setStep }) {
  const [code, setCode] = useState("");
  const [focusController, setFocusController] = useState(0);

  const router = useRouter();
  const { createToast } = useToast();

  useEffect(() => {
    if (code?.length < 6 && code.length > 0) {
      const element = document?.getElementById(
        `input-${code?.length + focusController}`
      );

      element && element.focus();
    }
  }, [code, focusController]);

  const stringManipulation = (e) => {
    if (e.target.value === "") {
      setFocusController(-1);
      return setCode(code.slice(0, -1));
    }
    setFocusController(0);
    return setCode(code + e.target.value);
  };

  const resendCode = useCallback(async () => {
    await api?.get(`/users/resend-confirmation/${data?.email}`).then((_res) => {
      createToast({
        status: "success",
        message: "Código reenviado com sucesso!",
      });
    });
  }, [data.email]);

  const submitCode = useCallback(() => {
    userService
      .confirmToken({ code, email: data?.email })
      .then((_res) => {
        setStep((prv) => prv + 1);

        createToast({
          status: "success",
          message: "Email confirmado com sucesso",
        });
      })
      .catch(() => {
        createToast({
          status: "error",
          message:
            "Código inválido, verifique o código informado e tente novamente",
        });
      });
  }, [code, data?.email]);

  return (
    <S.Step3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitCode();
        }}
      >
        <h3 style={{ color: "#ffffff" }}>
          {data?.name}, para continuarmos, informe abaixo o{" "}
          <strong>CÓDIGO</strong> que enviamos no seu email:
        </h3>
        <h4 style={{ color: "#ffffff" }}>
          Isso garante segurança para todos nós!
        </h4>
        <h5 className="uk-margin-remove" style={{ color: "#ffffff" }}>
          CÓDIGO DE VERIFICAÇÃO
        </h5>
        <div className="uk-width-1-4 uk-flex">
          <S.InputBox>
            <Input
              id="input-0"
              value={code[0]}
              onChange={(e) => stringManipulation(e)}
            />
          </S.InputBox>
          <S.InputBox>
            <Input
              id="input-1"
              value={code[1]}
              onChange={(e) => stringManipulation(e)}
            />
          </S.InputBox>
          <S.InputBox>
            <Input
              id="input-2"
              value={code[2]}
              onChange={(e) => stringManipulation(e)}
            />
          </S.InputBox>
          <S.InputBox>
            <Input
              id="input-3"
              value={code[3]}
              onChange={(e) => stringManipulation(e)}
            />
          </S.InputBox>
          <S.InputBox>
            <Input
              id="input-4"
              value={code[4]}
              onChange={(e) => stringManipulation(e)}
            />
          </S.InputBox>
          <S.InputBox>
            <Input
              id="input-5"
              value={code[5]}
              onChange={(e) => stringManipulation(e)}
            />
          </S.InputBox>
        </div>
        <div className="uk-margin-small-top">
          <span
            className="font-12 uk-link uk-text-muted"
            onClick={() => resendCode()}
          >
            Reenviar código
          </span>
        </div>
        <footer className="uk-flex  uk-margin-large-top">
          <Button
            onClick={() => setStep((prv) => prv - 1)}
            type="button"
            text="Voltar"
          />

          <Button type="submit" text="Confirmar" />
        </footer>
        <div className="uk-margin-small-top">
          <span className="font-12 uk-link" onClick={() => router.push("/")}>
            Já possuo conta
          </span>
        </div>
      </form>
    </S.Step3>
  );
}
