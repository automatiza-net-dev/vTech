import React from "react";

import { Error } from "infinity-forge";

import * as S from "./styles";

export function FaturamentoAgrupado(props) {
  return (
    <Error name="FaturamentoAgrupado">
      <S.FaturamentoAgrupado>
        {props?.faturamento_realizado && (
          <>
            <div className="top">
              <h3>{props.faturamento_realizado.description}</h3>

              <p>
                <strong>{props.faturamento_realizado.value}</strong>
              </p>
            </div>

            {props.items.map((item) => (
              <p className="item-description">{item?.value}</p>
            ))}
          </>
        )}
      </S.FaturamentoAgrupado>
    </Error>
  );
}
