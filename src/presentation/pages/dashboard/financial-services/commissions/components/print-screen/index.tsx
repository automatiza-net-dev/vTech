import moment from "moment";

import { PrintHeader } from "@/presentation";

import * as S from "./styles";

export function PrintScreen({ consolidated }) {
  return (
    <S.PrintScreen>
      <PrintHeader />
      <section className="title-section">
        <h1>Relatório de comissão por vendedor</h1>
        {moment(consolidated?.[0]?.dataInicio).format("DD/MM/YYYY")} à{" "}
        {moment(consolidated?.[0]?.dataFim).format("DD/MM/YYYY")}
      </section>
      <table>
        <thead>
          <tr>
            <th style={{ paddingLeft: 25 }}>Nome Vendedor</th>
            <th style={{ textAlign: "right" }}>Total Vendas</th>
            <th style={{ textAlign: "right", paddingRight: 25 }}>
              Valor Comissão
            </th>
          </tr>
        </thead>
        <tbody>
          {consolidated &&
            consolidated?.[0].vendedor?.map((item) => (
              <tr>
                <td style={{ paddingLeft: 25 }}>{item.nome}</td>
                <td style={{ textAlign: "right" }}>{item?.totalVendas}</td>
                <td style={{ textAlign: "right", paddingRight: 25 }}>
                  {item?.valorComissao}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </S.PrintScreen>
  );
}
