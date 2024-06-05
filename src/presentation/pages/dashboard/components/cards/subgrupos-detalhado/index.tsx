import React from "react";

import { Error } from "infinity-forge";

import * as S from "./styles";

export function SubgruposDetalhado(props) {
  if (!props.items || !Array.isArray(props.items) || props.items.length === 0) {
    return <></>;
  }

  return (
    <Error name="SubgruposDetalhado">
      <S.TableLevels>
        <h2>Faturamento Subgrupos</h2>

        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Qtd.</th>

              <th>Total</th>
              <th>%</th>
            </tr>
          </thead>

          <tbody>
            {(props.items as any).map((item) => (
              <React.Fragment key={item.id}>
                <tr className="primary">
                  <td>{item?.description || "-"}</td>

                  <td>{item?.quantity || "-"}</td>

                  <td>R$ {item?.total || "0,00"}</td>

                  <td>
                    {item?.percentage}
                  </td>
                </tr>

                {item?.children.map((child) => (
                  <tr className="second" key={child.id}>
                    <td>
                      <span>{child?.description || "-"}</span>
                    </td>

                    <td>{child?.quantity || "-"}</td>

                    <td>R$ {child?.total || "0,00"}</td>

                    <td>
                      {child?.percentage}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </S.TableLevels>
    </Error>
  );
}
