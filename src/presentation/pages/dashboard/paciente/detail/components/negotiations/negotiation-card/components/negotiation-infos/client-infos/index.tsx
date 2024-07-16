import { Error } from "infinity-forge";

import { IClientInfosProps } from "./interfaces";

import * as S from "./styles";

export function ClientInfos({ patientName, openUserName }: IClientInfosProps) {
  return (
    <Error name="ClientInfos">
      <S.ClientInfos>
        <div className="top_infos">
          <p>
            <strong>Cliente</strong> {patientName}
          </p>
          <p>
            <strong>AVALIADOR(A)</strong>
            {openUserName}
          </p>
        </div>

        <p>
          <strong>Relato do cliente</strong>
          <span>Adicionar aqui relato do cliente, desejos e expectativas</span>
        </p>
      </S.ClientInfos>
    </Error>
  );
}
