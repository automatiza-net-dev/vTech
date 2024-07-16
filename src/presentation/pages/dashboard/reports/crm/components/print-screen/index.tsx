import { OpportunityReport } from "@/domain";

import { useMe } from "@/presentation";

import PrintHeader from "@/OLD/components/mini-components/Print/PrintHeader";

import moment from "moment";

import * as S from "./styles";

export function PrintScreen({ reports }: { reports: OpportunityReport[] }) {
  const user = useMe();

  return (
    <S.PrintScreen>
      {user.data && <PrintHeader unit={user.data.unit} />}
      <h2>Relatório de oportunidades CRM</h2>
      <table>
        <thead>
          <tr>
            <td>celular contato</td>
            <td>data abertura</td>
            <td>data contato</td>
            <td>data lanç.</td>
            <td>nome ctt</td>
            <td>resp.</td>
            <td>situação</td>
            <td>tipo ctt</td>
            <td>titulo oportunidade</td>
            <td>unidade</td>
            <td>vlr ganho</td>
            <td>vlr oportunidade</td>
          </tr>
        </thead>
        <tbody>
          {reports?.map((report) => (
            <tr>
              <td>{report.celular_contato}</td>
              <td>{moment(report.data_abertura).format("DD/MM/YYYY")}</td>
              <td>{moment(report.data_contato).format("DD/MM/YYYY")}</td>
              <td>{moment(report.data_lancamento).format("DD/MM/YYYY")}</td>
              <td>{report.nome_contato}</td>
              <td>{report.responsavel}</td>
              <td>{report.situacao}</td>
              <td>{report.tipo_contato}</td>
              <td>{report.titulo_oportunidade}</td>
              <td>{report.unidade}</td>
              <td>{report.valor_ganho}</td>
              <td>{report.valor_oportunidade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </S.PrintScreen>
  );
}
