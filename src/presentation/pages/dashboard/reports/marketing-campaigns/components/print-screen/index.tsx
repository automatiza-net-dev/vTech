import moment from "moment";
import { formatNumberToCurrency } from "infinity-forge";

import { PrintHeader } from "@/presentation";

import * as S from "./styles";

export function PrintScreen({ reports }) {
  return (
    <S.PrintScreen>
      <PrintHeader />
      <h2>Relatório de campanhas de marketing</h2>
      {reports?.map((group) =>
        group?.group?.units?.map((unit) =>
          unit?.campaigns?.map((campaign) => (
            <>
              <table key={unit?.id}>
                <thead>
                  <tr>
                    <th>Unidade</th>
                    <th>Campanha mkt</th>
                    <th> Data inicio </th>
                    <th>Data fim</th>
                    <th>Valor investido</th>
                    <th>Qtd Leads Gerados</th>
                    <th>Custo por Lead (cpl)</th>
                    <th>Valor gerado Ganhos campanha</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{unit?.identification}</td>
                    <td>{campaign?.description}</td>
                    <td>{moment(campaign?.startDate).format("DD/MM/YYYY")}</td>
                    <td>{moment(campaign?.endDate).format("DD/MM/YYYY")}</td>
                    <td>{formatNumberToCurrency(campaign?.investmentValue)}</td>
                    <td>{campaign?.qtyOpportunities}</td>
                    <td>{formatNumberToCurrency(campaign?.cpl)}</td>
                    <td>
                      {formatNumberToCurrency(campaign?.sumOpportunityProfit)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <table>
                <thead>
                  <tr>
                    <th>Status atual das oportunidades geradas</th>
                    <th>Novas oportunidades</th>
                    <th>Agendadas</th>
                    <th>Comparecidas</th>
                    <th>Faltou</th>
                    <th>Desmarcou</th>
                    <th>Fechadas</th>
                    <th>Perdas</th>
                    <th>Ganhos</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="inf-cel">Qtd leads por status</td>
                    <td>{campaign?.qtyNovas}</td>
                    <td>{campaign?.qtyAgendadas}</td>
                    <td>{campaign?.qtyComparecidas}</td>
                    <td>{campaign?.qtyFaltou}</td>
                    <td>{campaign?.qtyDesmarcou}</td>
                    <td>{campaign?.qtyFechadas}</td>
                    <td>{campaign?.qtyPerdas}</td>
                    <td>{campaign?.qtyGanhos}</td>
                  </tr>
                </tbody>
              </table>
              <hr />
            </>
          ))
        )
      )}
    </S.PrintScreen>
  );
}
