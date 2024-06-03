import Link from "next/link";

import { FormHandler, Input, InputPassword } from "infinity-forge";

import { Error } from "@/presentation";
import { useAuthFranchisor } from "../context";

import * as S from "./styles";

export function Login() {
  const { signIn } = useAuthFranchisor();

  return (
    <Error name="login">
      <S.Login>
        <div className="form-login">
          <FormHandler
            button={{ text: "ENTRAR" }}
            onSucess={async (data) => {
              const ipAddress = await fetch("https://api.ipify.org/")
                .then((res) => res.text())
                .then((res) => res);

              await signIn({
                ...data,
                system: process.env.clientName,
                ipAddress,
              });
            }}
          >
            <h3>Painel do franqueador</h3>
            <Input type="email" name="email" label="Email" />
            <InputPassword name="password" label="Senha" />
          </FormHandler>

          <div className="link-area-franqueado">
            <Link href="/">Área do franqueado</Link>
          </div>
        </div>
      </S.Login>
    </Error>
  );
}
