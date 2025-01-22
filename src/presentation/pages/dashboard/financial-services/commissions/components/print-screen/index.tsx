import moment from "moment";

import { PrintHeader } from "@/presentation";

import * as S from "./styles";

export function PrintScreen({ consolidated }) {
  return (
    <S.PrintScreen>
      <PrintHeader />
      <section className="title-section">
        <h1>Relatório de comissão por vendedor</h1>
        {moment(consolidated?.data?.[0]?.dataInicio).format(
          "DD/MM/YYYY"
        )} à {moment(consolidated?.data?.[0]?.dataFim).format("DD/MM/YYYY")}
      </section>
      <table>
        <thead>
          <tr>
            <th>Nome Vendedor</th>
            <th>Total Vendas</th>
            <th>Valor Comissão</th>
          </tr>
        </thead>
        <tbody>
          {consolidated &&
            consolidated?.[0].vendedor?.map((item) => (
              <tr>
                <td>{item.nome}</td>
                <td>{item?.totalVendas}</td>
                <td>{item?.valorComissao}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </S.PrintScreen>
  );
}
