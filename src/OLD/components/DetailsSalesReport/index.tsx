// @ts-nocheck
import * as React from "react";

import { useDetailedSalesReport } from "@/OLD/hooks/useReports";
import { useProfile, useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Button } from "antd";
import { Container } from "./styles";
import Filters from "./Filters";
import PrintScreen from "./PrintScreen";
import AccessDenied from "@/OLD/components/AccessDenied";


import * as XLSX from "xlsx/xlsx.mjs";
import moment from "moment";

const DetailsSalesReport = React.memo(function DetailsSalesReport() {
  const [filters, setFilters] = React.useState({});

  const { reports, loadingReports } = useDetailedSalesReport(filters);
  const { clinic } = useProfile();

  const listDetailedSalesReportsPermission = useUserHasPermission("REL04");

  React.useEffect(() => {
    setFilters({ ...filters, economicGroups: [clinic?.economicGroup?.id] });
  }, [clinic]);

  const componentRef = React.useRef();

  const handleExport = () => {
    const formatted =
    process.env.client !== "liftone"
        ? reports?.map((item) => ({
            sistema: item?.sistema,
            grupo: item?.grupo,
            cidade: item?.cidade,
            Uf: item?.uf || "-",
            data_venda: item?.data_venda
              ? moment(item?.data_venda)?.utc()?.format("DD/MM/YYYY")
              : "-",
            hora_venda: item?.hora_venda
              ? moment(item?.hora_venda, "HH:mm")?.format("HH:mm")
              : "-",
            codigo_venda: item?.codigo_venda,
            vendedor: item?.vendedor,
            data_cadastro_cliente: item?.data_cadastro_cliente
              ? moment(item?.data_cadastro_cliente).format("DD/MM/YYYY")
              : "-",
            nome_cliente: item?.nomecliente,
            cpf_cnpj: item?.cpfcnpj || "-",
            celular_cliente: item?.cellphone,
            origem_cliente: item?.origem_cliente,
            profissao_cliente: item?.profissao_cliente || "-",
            cep_cliente: item?.cep_cliente || "-",
            endereco_cliente: item?.endereço_cliente || "-",
            numero_endereco_cliente: item?.numero_endereco_cliente || "-",
            complemento_cliente: item?.complemento_endereco_cliente || "-",
            bairro_cliente: item?.bairro_cliente || "-",
            cidade_cliente: item?.cidade_cliente || "-",
            uf_cliente: item?.uf_cliente || "-",
            dependente: item?.dependente || "-",
            dependente_rg: item?.dependente_rg || "-",
            dt_nasc_dep: item?.data_nasc_dep
              ? moment(item?.data_nasc_dep).format("DD/MM/YYYY")
              : "-",
            genero_dep: item?.genero_dep === "female" ? "Femea" : "Macho",
            especie_dep: item?.especie_dep || "-",
            raca_dep: item?.raca_dep || "-",
            castrado: item?.castrado_dep || "-",
            vacinado: item?.vacinado_dep || "-",
            ultimo_peso: item?.weight || "-",
            obito_dep: item?.obito_dep || "-",
            data_obito_dep: item?.data_obito_dep
              ? moment(item?.data_obito_dep).format("DD/MM/YYYY")
              : "-",
            tipo_item: item?.tipo_item || "-",
            subgrupo_item: item?.subgrupo_item || "-",
            descricao_item: item?.descricao_item || "-",
            qtd_item: item?.qtd_item || "-",
            valor_unit_item: item?.valor_unitario_item,
            valor_bruto_item: item?.valor_bruto_item,
            valor_desconto_item: item?.valor_desconto_item,
            valor_liq_item: item?.valor_liquido_item,
          }))
        : reports?.map((item) => ({
            sistema: item?.sistema,
            grupo: item?.grupo,
            cidade: item?.cidade,
            Uf: item?.uf || "-",
            data_venda: item?.data_venda
              ? moment(item?.data_venda)?.utc().format("DD/MM/YYYY")
              : "-",
            hora_venda: item?.hora_venda
              ? moment(item?.hora_venda, "HH:mm")?.format("HH:mm")
              : "-",
            codigo_venda: item?.codigo_venda,
            vendedor: item?.vendedor,
            data_cadastro_cliente: item?.data_cadastro_cliente
              ? moment(item?.data_cadastro_cliente).format("DD/MM/YYYY")
              : "-",
            nome_cliente: item?.nomecliente,
            cpf_cnpj: item?.cpfcnpj || "-",
            celular_cliente: item?.cellphone,
            origem_cliente: item?.origem_cliente,
            profissao_cliente: item?.profissao_cliente || "-",
            cep_cliente: item?.cep_cliente || "-",
            endereco_cliente: item?.endereço_cliente || "-",
            numero_endereco_cliente: item?.numero_endereco_cliente || "-",
            complemento_cliente: item?.complemento_endereco_cliente || "-",
            bairro_cliente: item?.bairro_cliente || "-",
            cidade_cliente: item?.cidade_cliente || "-",
            uf_cliente: item?.uf_cliente || "-",
            ultimo_peso: item?.weight || "-",
            tipo_item: item?.tipo_item || "-",
            subgrupo_item: item?.subgrupo_item || "-",
            descricao_item: item?.descricao_item || "-",
            qtd_item: item?.qtd_item || "-",
            valor_unit_item: item?.valor_unitario_item,
            valor_bruto_item: item?.valor_bruto_item,
            valor_desconto_item: item?.valor_desconto_item,
            valor_liq_item: item?.valor_liquido_item,
          }));

    let wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(formatted);

    XLSX.utils.book_append_sheet(wb, ws, "Pág " + "1");

    XLSX.writeFile(wb, "Vendas detalhado" + ".xlsx");
  };

  return !listDetailedSalesReportsPermission ||
    listDetailedSalesReportsPermission === "loading" ? (
    <AccessDenied loading={loadingReports} />
  ) : (
    <Container className="uk-padding-small">
      <h3 className="uk-margin-remove">Relatório detalhado de vendas</h3>
      <Filters filters={filters} setFilters={setFilters} />
      <div className="uk-flex uk-flex-around">
        {/* <ReactToPrint
          trigger={() => <Button>Imprimir</Button>}
          content={() => componentRef?.current}
  /> */}
        <Button onClick={() => handleExport()}>Exportar (Excel)</Button>
      </div>
      <div style={{ display: "none" }}>
        <div ref={componentRef}>
          <PrintScreen reports={reports} />
        </div>
      </div>
    </Container>
  );
});

export default DetailsSalesReport;
