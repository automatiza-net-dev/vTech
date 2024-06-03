// @ts-nocheck
import { memo, useRef } from "react";

import { useProfile } from "@/OLD/hooks/useProfile";
import { useAuth } from "@/OLD/hooks/useAuth";

import { Container, RowBox } from "./styles";
import { Button, Empty } from "antd";
import PrintHeader from "@/OLD/components/mini-components/Print/PrintHeader";

import ReactToPrint from "react-to-print";
import { currencyFormatter } from "@/OLD/components/Budget";
import moment from "moment";
import * as XLSX from "xlsx/xlsx.mjs";

const PrintTable = memo(function PrintTable({ data = [], loading }) {
  const { clinic } = useProfile();
  

  

  const componentRef = useRef();

  const handleExport = () => {
    const formatted =
      process.env.client !== "liftone"
        ? data?.map((item) => ({
            unidade_de_negocios: item?.unit?.identification,
            cidade: item?.unit.city,
            uf: item?.unit?.state,
            data_venda: item?.billDate
              ? moment(item?.billDate).format("DD/MM/YYYY")
              : "-",
            hora_venda: item?.billDate
              ? moment(item?.billDate).format("HH:mm")
              : "-",
            codigo_venda: item?.tag,
            valor_servicos: item?.serviceValue,
            valor_produtos: item?.productValue,
            valor_total: item?.totalValue,
            valor_pago: item?.paidValue,
            valor_aberto: item?.missingPaymentValue,
            data_cadastro_cliente: item?.client?.createdAt
              ? moment(item?.client?.createdAt).format("DD/MM/YYYY")
              : "-",
            nome_cliente: item?.client?.name,
            cpf_cnpj: item?.client.document,
            celular_cliente: item?.client?.cellphone,
            origem_cliente: item?.client?.origin,
            profissao_cliente: item?.client?.profession,
            cep_cliente: item?.client?.postalCode,
            endereco_cliente: item?.client?.street,
            numero_endereco_cliente: item?.client?.number,
            complemento_endereco_cliente: item?.client?.complement,
            bairro_endereco_cliente: item?.client?.district,
            cidade_cliente: item?.client?.city,
            uf_cliente: item?.client?.state,
            dependente: item?.patient?.name,
            dependente_rg: item?.patient?.tag,
            data_nasc_dep: item?.patient?.birthDate
              ? moment(item?.patient?.birthDate).format("DD/MM/YYYYY")
              : "-",
            genero_dep: item?.patient?.gender === "female" ? "Fêmea" : "Macho",
            especie_dep: item?.patient?.race?.specie?.description,
            raca_dep: item?.patient?.race?.description,
            castrado_dep: item?.patient?.castrated ? "Sim" : "Não",
            vacinado_dep: item?.vaccineOrigin || "-",
            ultimo_peso: item?.patient?.weight,
            obito_dep: item?.patient?.death ? "Sim" : "Não",
            data_obito_dep: item?.patient?.deathDate
              ? moment(item?.patient?.deathDate).format("DD/MM/YYYY")
              : "-",
          }))
        : data?.map((item) => ({
            unidade_de_negocios: item?.unit?.identification,
            cidade: item?.unit.city,
            uf: item?.unit?.state,
            data_venda: item?.billDate
              ? moment(item?.billDate).format("DD/MM/YYYY")
              : "-",
            codigo_venda: item?.tag,
            valor_servicos: item?.serviceValue,
            valor_produtos: item?.productValue,
            valor_total: item?.totalValue,
            valor_pago: item?.paidValue,
            valor_aberto: item?.missingPaymentValue,
            data_cadastro_cliente: item?.client?.createdAt
              ? moment(item?.client?.createdAt).format("DD/MM/YYYY")
              : "-",
            nome_cliente: item?.client?.name,
            cpf_cnpj: item?.client.document,
            celular_cliente: item?.client?.cellphone,
            origem_cliente: item?.client?.origin,
            profissao_cliente: item?.client?.profession,
            cep_cliente: item?.client?.postalCode,
            endereco_cliente: item?.client?.street,
            numero_endereco_cliente: item?.client?.number,
            complemento_endereco_cliente: item?.client?.complement,
            bairro_endereco_cliente: item?.client?.district,
            cidade_cliente: item?.client?.city,
            uf_cliente: item?.client?.state,
          }));

    let wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(formatted);

    XLSX.utils.book_append_sheet(wb, ws, "Pág " + "1");

    XLSX.writeFile(wb, "vendas" + ".xlsx");
  };

  return (
    <>
      <Container ref={componentRef}>
        <div className="clinic-header">
          <PrintHeader unit={clinic} />
          <div className="uk-text-center">
            <h4 className="">Relatório de vendas</h4>
          </div>
        </div>
        <div className="table-section">
          <section className="header-table">
            <div>unidade</div>
            <div>cidade</div>
            <div>uf</div>
            <div>data</div>
            <div>cod_venda</div>
            <div>vlr_serv</div>
            <div>vlr_prod</div>
            <div>vlr_total</div>
            <div>vlr_pago</div>
            <div>vlr_aberto</div>
            <div>cliente_resp</div>
            <div>telefone</div>
            <div>origem_cliente</div>
            <div>pet</div>
            <div>rg_pet</div>
          </section>
          <section className="table-box">
            {loading ? (
              <div className="uk-text-center">Carregando...</div>
            ) : data?.length > 0 ? (
              data?.map((item) => (
                <RowBox>
                  <div>{item?.unit?.identification}</div>
                  <div>{item?.unit?.city}</div>
                  <div>{item?.unit?.state}</div>
                  <div>
                    {item?.billDate
                      ? moment(item?.billDate).format("DD/MM/YYYY")
                      : "-"}
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
                    {item?.totalValue
                      ? currencyFormatter(item?.totalValue)
                      : "-"}
                  </div>
                  <div>
                    {item?.paidValue ? currencyFormatter(item?.paidValue) : "-"}
                  </div>
                  <div>
                    {item?.missingPaymentValue
                      ? currencyFormatter(item?.missingPaymentValue)
                      : "-"}
                  </div>
                  <div>{item?.client?.name}</div>
                  <div>{item?.client?.cellphone}</div>
                  <div>{item?.client?.origin}</div>
                  <div>{item?.patient?.name}</div>
                  <div>{item?.patient?.tag}</div>
                </RowBox>
              ))
            ) : (
              <Empty className="uk-margin-top" />
            )}
          </section>
        </div>
      </Container>

      <div className="uk-margin-top uk-flex uk-flex-right">
        <Button
          className="uk-margin-small-right"
          onClick={() => handleExport()}
        >
          Exportar (Excel)
        </Button>
        <ReactToPrint
          trigger={() => (
            <Button className="uk-margin-small-right">Imprimir</Button>
          )}
          content={() => componentRef.current}
        />
      </div>
    </>
  );
});

export default PrintTable;
