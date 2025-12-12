import {
  api,
  formatNumberToCurrency,
  Input,
  InputPassword,
} from "infinity-forge";

import * as S from "./styles";

export function ScheduleAuthorization({
  value,
  blocking,
}: {
  value: number;
  blocking?: boolean;
}) {
  return (
    <S.ScheduleAuthorization>
      <p className="font-14-regular">
        Cliente com pendencia Financeira{" "}
        <strong style={{ color: "red" }}>
          ({formatNumberToCurrency(value)})
        </strong>{" "}
        <br />É necessário <strong>autorização</strong> do supervisor para
        criação do agendamento
      </p>

      {blocking && (
        <div className="row">
          <Input name="userEmail" type="email" label="Usuário (e-mail)" />

          <InputPassword name="userPwd" label="Senha" />
        </div>
      )}
    </S.ScheduleAuthorization>
  );
}
