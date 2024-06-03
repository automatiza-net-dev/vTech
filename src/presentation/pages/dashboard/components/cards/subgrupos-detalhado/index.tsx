import React from "react";
import { Error } from "infinity-forge";
import * as S from "./styles";

export function SubgruposDetalhado(props) {
  console.log(props);
  return (
    <Error name="SubgruposDetalhado">
      <S.SubgruposDetalhado>
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th className="text-right">Total</th>
              <th className="text-right">%</th>
              <th className="text-right">Qtd.</th>
            </tr>
          </thead>
          <tbody>
            {(props.items as any).map((item) => (
              <React.Fragment key={item.id}>
                <tr className="first-section-subgroup">
                  <td>{item?.description}</td>
                  <td className="text-right">R$: {item?.total}</td>
                  <td className="text-right">{item?.percentage.toFixed(2)}%</td>
                  <td className="text-right">{item?.quantity}</td>
                </tr>
                {item?.children.map((child) => (
                  <tr className="second-section-sugroup" key={child.id}>
                    <td>{child?.description}</td>
                    <td className="text-right">R$: {child?.total}</td>
                    <td className="text-right">
                      {child?.percentage.toFixed(2)}%
                    </td>
                    <td className="text-right">{child?.quantity}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </S.SubgruposDetalhado>
    </Error>
  );
}
