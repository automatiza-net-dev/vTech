import Link from "next/link";

import {
  api,
  Input,
  cookies,
  FormHandler,
  useAuthAdmin,
  InputPassword,
} from "infinity-forge";

import * as S from "./styles";

export function SignInAdmin() {
  const { loadUser } = useAuthAdmin();

  return (
    <S.Login>
      <div className="form-login">
        <FormHandler
          debugMode
          isStickyButtons
          button={{ text: "ENTRAR" }}
          onSucess={async (data) => {
            const ipAddress = await api({ url: "ip", method: "get" }, "/api/");

            const response = await api({
              url: "auth/controller-login",
              method: "post",
              body: {
                ...data,
                system: process.env.clientName,
                ipAddress,
              },
            });

            cookies.set("token", { value: response?.token });

            await loadUser();
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
  );
}
