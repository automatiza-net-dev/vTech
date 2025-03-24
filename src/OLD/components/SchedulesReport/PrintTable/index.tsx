import { useRef } from "react";

import { Button, Empty } from "antd";
import { PrintHeader, useConfigurationsSystem } from "@/presentation";

import { useReactToPrint } from "react-to-print";
import moment from "moment";
import * as XLSX from "xlsx/xlsx.mjs";

import { Container, RowBox } from "./styles";
import { reportsService } from "@/OLD/services/reports.service";

function PrintTable({ schedules, filters, setReload, setFilters }) {
  const componentRef = useRef();

  const { type } = useConfigurationsSystem();

  const handleExport = async (data) => {
    const keys = Object.keys(data);
    let newObj = { ...data };

    if (keys.includes("fromDate")) {
      newObj = {
        ...newObj,
        fromDate: moment(data?.fromDate).startOf("day").format("YYYY-MM-DD"),
        toDate: moment(data.toDate).endOf("day").format("YYYY-MM-DD"),
      };
    }

    const response = await reportsService
      .getSchedulingReports(newObj)
      .then((res) => res.data);

    const formatted =
      type === "Vet"
        ? response?.map((item) => ({
            unidade_de_negocios: item?.identification,
            estado: item?.unit_state,
            data_inicio: item?.start_hour_date,
            hora_inicio: item?.start_hour_time,
            duracao_prevista: item?.reserved_minutes,
            inicio_atendimento: item?.started_at
              ? moment(item?.started_at).format("DD/MM/YYYY - HH:mm")
              : "-",
            finalizado_em: item?.finished_at
              ? moment(item?.finished_at_at).format("DD/MM/YYYY - HH:mm")
              : "-",
            duracao_atendimento: item?.minutos_duracao_atendimento
              ? parseFloat(item?.minutos_duracao_atendimento)?.toFixed(2)
              : "-",
            status: item?.status,
            tipo_agendamento: item?.tipo_agendamento,
            servico: item?.description,
            usuario_cancelamento: item?.usuario_cancelamento,
            data_cancelamento: item?.data_cancelamento
              ? moment(item?.data_cancelamento)?.format("DD/MM/YYYY - HH:mm")
              : "-",
            motivo_cancelamento: item?.motivo_cancelamento,
            tem_retorno: item?.tem_retorno,
            e_um_retorno: item?.e_retorno,
            data_cadastro_tutor: item?.datac_adastro_tutor
              ? moment(item?.datac_adastro_tutor).format("DD/MM/YYYY - HH:mm")
              : "-",
            nome_cliente: item?.nome_tutor,
            cpf_cnpj_tutor: item?.cpf_cnpj_tutor,
            celular: item?.cellphone,
            origem_cliente: item?.origem_tutor,
            profissao_cliente: item?.profissao_tutor,
            cep_cliente: item.postal_code,
            endereco_cliente: item?.street,
            numero_endereco_cliente: item?.number,
            complemento_cliente: item?.complement,
            bairro_cliente: item?.district,
            cidade: item?.city,
            uf: item?.state,
            dependente: item?.nome_paciente,
            dependente_rg: item?.rg_paciente,
            data_nasc_dep: item?.nasc_paciente
              ? moment(item?.nasc_paciente).format("DD/MM/YYYY")
              : "-",
            genero_dep: item?.genero_paciente,
            especie_dep: item?.especie_paciente,
            raca_dep: item?.raca_paciente,
            castrado: item?.castrado_paciente,
            vacinado: item?.vacinado,
            ultimo_peso: item?.peso_paciente,
            obito_dep: item?.obito_paciente,
            data_obito_dep: item?.data_obito_paciente || "-",
            "Usuario Lancamento Agenda": item?.creation_user_name,
            "Profissional Responsavel": item?.professional_user_name,
          }))
        : schedules?.map((item) => ({
            unidade_de_negocios: item?.identification,
            estado: item?.unit_state,
            data_inicio: item?.start_hour_date,
            hora_inicio: item?.start_hour_time,
            duracao_prevista: item?.reserved_minutes,
            inicio_atendimento: item?.started_at
              ? moment(item?.started_at).format("DD/MM/YYYY - HH:mm")
              : "-",
            finalizado_em: item?.finished_at
              ? moment(item?.finished_at_at).format("DD/MM/YYYY - HH:mm")
              : "-",
            duracao_atendimento: item?.minutos_duracao_atendimento
              ? parseFloat(item?.minutos_duracao_atendimento)?.toFixed(2)
              : "-",
            status: item?.description,
            tipo_agendamento: item?.tipo_agendamento,
            servico: item?.description,
            usuario_cancelamento: item?.usuario_cancelamento,
            data_cancelamento: item?.data_cancelamento
              ? moment(item?.data_cancelamento)?.format("DD/MM/YYYY - HH:mm")
              : "-",
            motivo_cancelamento: item?.motivo_cancelamento,
            tem_retorno: item?.tem_retorno,
            e_um_retorno: item?.e_retorno,
            data_cadastro_cliente: item?.datac_adastro_tutor
              ? moment(item?.datac_adastro_tutor).format("DD/MM/YYYY - HH:mm")
              : "-",
            nome_cliente: item?.nome_tutor,
            cpf_cnpj_cliente: item?.cpf_cnpj_tutor,
            celular: item?.cellphone,
            origem_cliente: item?.origem_tutor,
            profissao_cliente: item?.profissao_tutor,
            cep_cliente: item.postal_code,
            endereco_cliente: item?.street,
            numero_endereco_cliente: item?.number,
            complemento_cliente: item?.complement,
            bairro_cliente: item?.district,
            cidade: item?.city,
            uf: item?.state,
            "Usuario Lancamento Agenda": item?.creation_user_name,
            "Profissional Responsavel": item?.professional_user_name,
          }));

    let wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(formatted);

    XLSX.utils.book_append_sheet(wb, ws, "Pág " + "1");

    XLSX.writeFile(wb, "Agendamentos" + ".xlsx");
  };

  const imprimir = useReactToPrint({ contentRef: componentRef });

  return (
    <>
      <Container ref={componentRef as any} className="uk-margin-small-top">
        <div className="clinic-header">
          <PrintHeader />
          <div className="uk-text-center">
            <h4 className="">Relatório de agendamentos</h4>
          </div>
        </div>
        <div className="table-section">
          <section className="header-table">
            <div>unidade</div>
            <div>cidade/uf</div>
            <div>data_inicio</div>
            <div>data_fim</div>
            <div>duracao_prev</div>
            <div>finalizado_em</div>
            <div>status</div>
            <div>servico</div>
            <div>usuario_canc</div>
            <div>motivo_canc</div>
            <div>cancelado_em</div>
            <div>tem_retorno</div>
            <div>e_um_retorno</div>
            {type === "Vet" && <div>nome_pet</div>}
            {type === "Vet" && <div>rg_paciente</div>}
            <div>
              {type === "Vet" ? "tutor_resp" : "cliente_resp"}
            </div>
            <div>
              {type === "Vet"
                ? "cpf_cnpj_resp"
                : "cpf_cnpj_cliente"}
            </div>

            <div>Usuario Lancamento Agenda</div>

            <div>Profissional Responsavel</div>
          </section>{" "}
          {schedules?.length > 0 ? (
            <section className="table-box">
              {schedules?.map((item) => (
                <RowBox>
                  <div>{item?.identification}</div>
                  <div>
                    {item?.city}/{item?.state}
                  </div>
                  <div>{item?.start_hour_date}</div>
                  <div>{item?.end_hour_date}</div>
                  <div>{item?.reservedMinutes?.toFixed(0)}</div>
                  <div>{item?.end_hour_time}</div>
                  <div>{item?.status}</div>
                  <div>{item?.tipo_agendamento}</div>
                  <div>{item?.usuario_cancelamento || "-"}</div>
                  <div>{item?.motivo_cancelamento || "-"}</div>
                  <div>{item?.data_cancelamento}</div>
                  <div>{item?.tem_retorno}</div>
                  <div>{item?.e_retorno}</div>
                  {type === "Vet" && (
                    <div>{item?.nome_paciente}</div>
                  )}
                  {type === "Vet" && (
                    <div>{item?.rg_paciente}</div>
                  )}
                  <div>{item?.nome_tutor}</div>
                  <div>{item?.cpf_cnpj_tutor}</div>
                  <div>{item?.creation_user_name}</div>
                  <div>{item?.professional_user_name}</div>
                </RowBox>
              ))}
            </section>
          ) : (
            <div className="uk-padding">
              <Empty />
            </div>
          )}
        </div>
        <section className="uk-margin-top uk-flex uk-flex-center"></section>
      </Container>
      <div className="uk-margin-top uk-flex uk-flex-right">
        <Button
          className="uk-margin-small-right"
          onClick={() => {
            handleExport(filters);
          }}
        >
          Exportar (Excel)
        </Button>

        <Button
          className="uk-margin-small-right"
          onClick={() => {
            setFilters((prv) => ({ ...prv, noSearch: false }));
            setReload((prv) => !prv);

            setTimeout(() => {
              imprimir();
            }, 400);
          }}
        >
          Imprimir
        </Button>
      </div>
    </>
  );
}

export default PrintTable;
