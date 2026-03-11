import moment from "moment";
import * as XLSX from "xlsx/xlsx.mjs";
import { Button } from "infinity-forge";

import { RemotePatientReports } from "@/data";
import { container, patientTypes } from "@/container";

export function ExportButton({ exportData }) {

  return (
    <Button
      text="Exportar Excel"
      onClick={async () => {
      const patientReports = await container
        .get<RemotePatientReports>(patientTypes.RemotePatientReports)
        .loadAllPatientReports(exportData);

        const data = patientReports?.map((report) => ({
          responsavel: report?.tutorNome,
          cel: report?.tutorCelular,
          fone: report?.tutorTelefone,
          email: report?.tutorEmail,
          genero_responsavel: report?.tutorGenero,
          profissao: report?.tutorProfissao,
          dt_nasc_tutor: report?.tutorDtNasc
            ? moment(report?.tutorDtNasc).format("DD/MM/YYYY")
            : "-",
          rg_pet: report?.petRg,
          nome_pet: report?.petNome,
          comunidade_sancla: report?.petComunidadeSancla ? "Sim" : "Nao",
          genero_pet: report?.petGenero,
          dt_nasc_pet: report?.petDtNascimento
            ? moment(report?.petDtNascimento)
            : "-",
          vacinado: report?.petVacinado,
          ["especie>raca"]: report?.petEspecieraca,
          obito: report?.petObito,
          castrado: report?.petCastrado,
          ultimo_peso: report?.petPeso,
          observacoes: report?.petObservacao,
          dt_cadastro_pet: report?.petDtCadastro
            ? moment(report?.petDtCadastro).format("DD/MM/YYYY")
            : "-",
          dt_cadastro_tutor: report?.tutorDtCadastro
            ? moment(report?.tutorDtCadastro).format("DD/MM/YYYY")
            : "-",
          tem_protoclo_vacina: report?.petTemProtocoloVacina,
          data_primeira_compra_pet: report?.petDataPrimeiraVenda,
          data_ultima_compra_pet: report?.petDataUltimaVenda,
        }));

        let wb = XLSX.utils.book_new(),
          ws = XLSX.utils.json_to_sheet(data);
    
        XLSX.utils.book_append_sheet(wb, ws, "Pág " + "1");
    
        XLSX.writeFile(wb, "relatório-pacientes" + ".xlsx");
      }}
    />
  );
}
