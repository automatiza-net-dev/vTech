import moment from "moment";
import * as XLSX from "xlsx/xlsx.mjs";
import { useQueryClient, Button } from "infinity-forge";

import {
  useLoadAllPatientReportsKEY,
  useLoadAllPatientReports,
} from "@/presentation";

export function ExportButton() {
  const refetch = useQueryClient((state) => state.refetch);

  const patientReports = useLoadAllPatientReports();

  async function handleExport() {
    const data = patientReports?.data?.map((report) => ({
      tutor: report?.tutorNome,
      cel: report?.tutorCelular,
      fone: report?.tutorTelefone,
      email: report?.tutorEmail,
      genero_tutor: report?.tutorGenero,
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
  }

  return (
    <Button
      text="Exportar Excel"
      onMouseOver={() => refetch(useLoadAllPatientReportsKEY())}
      onClick={() => handleExport()}
    />
  );
}
