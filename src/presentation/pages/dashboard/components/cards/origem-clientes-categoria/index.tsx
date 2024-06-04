import React from "react";
import { Error } from "infinity-forge";
import * as S from "./styles";

export function OrigemClientesCategoria(props) {
  return (
    <Error name="OrigemClientesCategoria">
      <S.OrigemClientesCategoria>
        <h2>Origem clientes</h2>
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Fatur.</th>
              <th>Porcent.</th>
            </tr>
          </thead>
          <tbody>
            {(props.items as any).categories.map((item) => (
              <React.Fragment key={item.id}>
                <tr className="first-row">
                  <td>{item?.categoria}</td>
                  <td>R$: {item?.faturamento}</td>
                  <td>{item?.porcentagem.toFixed(2)}%</td>
                </tr>
                {item?.grupos.map((group) => (
                  <React.Fragment key={group.id}>
                    <tr className="second-row">
                      <td>{group?.grupo}</td>
                      <td>R$: {group?.total}</td>
                      <td>{group?.porcentagem.toFixed(2)}%</td>
                    </tr>
                    {group?.origem_clientes.map((origin) => (
                      <tr className="third-row" key={origin.id}>
                        <td>{origin?.origem}</td>
                        <td>R$: {origin?.total}</td>
                        <td>{origin?.porcentagem.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </S.OrigemClientesCategoria>
    </Error>
  );
}
