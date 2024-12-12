import { Vaccine } from "@/domain";
import { PrintHeader, useMe } from "@/presentation";

import * as S from "./styles";

export function PrintVaccinesVermifugeReport({
  reports,
}: {
  reports: Vaccine[];
}) {

  return (
    <S.PrintVaccinesVermifuge>
      <PrintHeader />
      <h2>Relatório de {reports[0]?.vacina_vermifugo}</h2>
      <table>
        <thead>
          <tr>
            <th>Unidade</th>
            <th>Tutor</th>
            <th>Telefone</th>
            <th>Paciente</th>
            <th>Tipo</th>
            <th>Nome {reports[0]?.vacina_vermifugo}</th>
            <th>Descrição {reports[0]?.vacina_vermifugo}</th>
            <th>Protocolo</th>
            <th>Especie</th>
            <th>Data agendamento</th>
            <th>Dose</th>
            <th>Data Aplicação</th>
            <th>Laboratorio</th>
            <th>Lote</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 &&
            reports.map((item, i) => (
              <tr key={i}>
                <td>{item?.unidade}</td>
                <td>{item?.tutor}</td>
                <td>{item?.contato_tutor}</td>
                <td>{item?.paciente}</td>
                <td>{item?.vacina_vermifugo}</td>
                <td>{item?.nome_vacina}</td>
                <td>{item?.descricao_vacina}</td>
                <td>{item?.nome_protocolo}</td>
                <td>{item?.especie}</td>
                <td>{item?.data_agendamento ? item?.data_agendamento : "-"}</td>
                <td>{item?.dose}</td>
                <td>{item?.data_aplicacao ? item?.data_aplicacao : "-"}</td>
                <td>{item?.laboratorio}</td>
                <td>{item?.lote}</td>
                <td>{item?.status}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </S.PrintVaccinesVermifuge>
  );
}
