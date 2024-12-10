// @ts-nocheck
import { memo, useRef } from "react";

import { useProfile } from "@/OLD/hooks/useProfile";

import { Container, RowBox } from "./styles";
import { Empty } from "antd";
import { PrintHeader } from "@/presentation";
import { Button } from "infinity-forge";

import ReactToPrint from "react-to-print";
import { currencyFormatter } from "@/OLD/components/Budget";
import moment from "moment";
import * as XLSX from "xlsx/xlsx.mjs";
import { useDictionary } from "@/presentation";

function PrintTable({ reports }) {
  const { clinic } = useProfile();

  const componentRef = useRef();

  const handleExport = () => {
    const formatted =
      process.env.client !== "liftone"
        ? reports?.map((item) => ({
            unidade_de_negocios: item?.unit?.identification,
            cidade: item?.unit?.city,
            uf: item?.unit?.state,
            data_orcamento: moment(item?.budgetDate)
              ?.utc()
              ?.format("DD/MM/YYYY"),
            data_validade: moment(item?.expirationDate)
              ?.utc()
              ?.format("DD/MM/YYYY"),
            codigo_orcamento: item?.tag,
            valor_servicos: item?.serviceValue,
            valor_produtos: item?.productValue,
            valor_desconto: item?.discountValue,
            valor_total: item?.totalValue,
            "data_conf/canc": item?.finishedDate
              ? moment(item?.finishedDate).utc().format("DD/MM/YYYY")
              : "-",
            status: item?.status,
            observacao: item?.observation,
            observacao_cancelamento: item?.canceledObservation || "-",
            data_cadastro_cliente: item?.client?.createdAt
              ? moment(item?.client?.createdAt).format("DD/MM/YYYY")
              : "-",
            nome_cliente: item?.client?.name || item?.client_name,
            telefone: item?.client?.cellphone,
            cpf_cliente: item?.client?.document,
            origem_cliente: item?.client?.origin,
            profissao_cliente: item?.client?.profession || "-",
            cep_cliente: item?.client?.postalCode,
            endereco_cliente: item?.client?.street,
            numero_endereco_cliente: item?.client?.number,
            complemento: item?.client?.complement,
            bairro_cliente: item?.client?.district,
            cidade_cliente: item?.client?.city,
            uf_cliente: item?.client?.state,
            dependente: item?.patient?.name,
            dependente_rg: item?.patient?.tag,
            data_nasc_dependente: item?.patient?.birthDate
              ? moment(item?.patient?.birthDate).utc().format("DD/MM/YYYY")
              : "-",
            genero_dependente: item?.patient?.gender,
            especie_dep: item?.patient?.race?.specie?.description,
            raca_dep: item?.patient?.race?.description,
            castrado_dep: item?.patient?.castrated ? "Sim" : "Não",
            vacinado_dep: item?.patient?.vaccineOrigin || "Não",
            ultimo_peso: item?.patient?.weight,
            obito_dep: item?.patient?.death ? "Sim" : "Não",
            data_obito_dep: item?.patient?.deathDate
              ? moment(item?.patient?.deathDate).format("DD/MM/YYYY")
              : "-",
          }))
        : reports?.map((item) => ({
            unidade_de_negocios: item?.unit?.identification,
            cidade: item?.unit?.city,
            uf: item?.unit?.state,
            data_orcamento: moment(item?.budgetDate)
              ?.utc()
              ?.format("DD/MM/YYYY"),
            data_validade: moment(item?.expirationDate)
              ?.utc()
              ?.format("DD/MM/YYYY"),
            codigo_orcamento: item?.tag,
            valor_servicos: item?.serviceValue,
            valor_produtos: item?.productValue,
            valor_desconto: item?.discountValue,
            valor_total: item?.totalValue,
            "data_conf/canc": item?.finishedDate
              ? moment(item?.finishedDate).utc().format("DD/MM/YYYY")
              : "-",
            status: item?.status,
            observacao: item?.observation,
            observacao_cancelamento: item?.canceledObservation || "-",
            data_cadastro_cliente: item?.client?.createdAt
              ? moment(item?.client?.createdAt).utc().format("DD/MM/YYYY")
              : "-",
            nome_cliente: item?.client?.name || item?.client_name,
            telefone: item?.client?.cellphone,
            cpf_cliente: item?.client?.document,
            origem_cliente: item?.client?.origin,
            profissao_cliente: item?.client?.profession || "-",
            cep_cliente: item?.client?.postalCode,
            endereco_cliente: item?.client?.street,
            numero_endereco_cliente: item?.client?.number,
            complemento: item?.client?.complement,
            bairro_cliente: item?.client?.district,
            cidade_cliente: item?.client?.city,
            uf_cliente: item?.client?.state,
          }));

    let wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(formatted);

    XLSX.utils.book_append_sheet(wb, ws, "Pág " + "1");

    XLSX.writeFile(wb, "orcamentos" + ".xlsx");
  };

  const { getWord } = useDictionary();

  return (
    <>
      <Container ref={componentRef} className="uk-margin-small-top">
        <div className="clinic-header">
          <PrintHeader />
          <div className="uk-text-center">
            <h4 className="">Relatório de {getWord("Orçamentos")}</h4>
          </div>
        </div>
        <div className="table-section">
          <section className="header-table">
            <div>Identificacao</div>
            <div>Cidade</div>
            <div>Uf</div>
            <div>data_orc</div>
            <div>data_val</div>
            <div>codigo_orc</div>
            <div>vlr_serv</div>
            <div>vlr_prod</div>
            <div>vlr_desc</div>
            <div>vlr_total</div>
            <div>cliente_resp</div>
            <div>telefone</div>
            <div>origem_cliente</div>
            <div>dependente</div>
            <div>data_conf/canc</div>
            <div>status</div>
            <div>obs</div>
            <div>obs_canc.</div>
          </section>{" "}
          {reports?.length > 0 ? (
            <section className="table-box">
              {reports?.length > 0 &&
                reports?.map((item) => (
                  <RowBox>
                    <div>{item?.unit?.identification}</div>
                    <div>{item?.unit?.city}</div>
                    <div>{item?.unit?.state}</div>
                    <div>{moment(item?.budgetDate).format("DD/MM/YYYY")}</div>
                    <div>
                      {moment(item?.expirationDate).format("DD/MM/YYYY")}
                    </div>
                    <div>{item?.tag}</div>
                    <div>
                      {item?.serviceValue
                        ? currencyFormatter(item?.serviceValue)
                        : "-"}
                    </div>
                    <div>
                      {item?.productValue
                        ? currencyFormatter(item?.productValue)
                        : "-"}
                    </div>
                    <div>
                      {item?.discountValue
                        ? currencyFormatter(item?.discountValue)
                        : "-"}
                    </div>
                    <div>
                      {item?.totalValue
                        ? currencyFormatter(item?.totalValue)
                        : "-"}
                    </div>
                    <div>{item?.client?.name || item?.client_name}</div>
                    <div>{item?.client?.cellphone}</div>
                    <div>{item?.client?.origin}</div>
                    <div>{item?.patient?.name}</div>
                    <div>
                      {item?.finishedDate
                        ? moment(item?.finishedDate).format("DD/MM/YYYY")
                        : "-"}
                    </div>
                    <div>{item?.status}</div>
                    <div>{item?.observation}</div>
                    <div>{item?.canceledObservation || "-"}</div>
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
          onClick={() => handleExport()}
          text="Exportar (Excel)"
        />

        <ReactToPrint
          trigger={() => (
            <Button className="uk-margin-small-right" text="Imprimir" />
          )}
          content={() => componentRef.current}
        />
      </div>
    </>
  );
}

export default PrintTable;
