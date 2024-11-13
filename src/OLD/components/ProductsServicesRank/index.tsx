// @ts-nocheck
import { useState, useRef, useEffect } from "react";

import { useBusinessUnitsByUser } from "@/OLD/hooks/useBusinessUnits";
import { useEconomicGroup } from "@/OLD/hooks/useEconomicGroup";
import { useProductTypesReports } from "@/OLD/hooks/useReports";
import { useProfile } from "@/OLD/hooks/useProfile";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Container, InputBox } from "./styles";
import { Select, Button } from "antd";
import { DatePicker } from "@mui/x-date-pickers";
import PrintTable from "./PrintScreen";
import AccessDenied from "@/OLD/components/AccessDenied";
import { PageWrapper } from "infinity-forge";

import ReactToPrint from "react-to-print";
import * as XLSX from "xlsx/xlsx.mjs";

export function ProductsServicesRank() {
  const [filters, setFilters] = useState({});
  const [reload, setReload] = useState(false);
  const [cities, setCities] = useState([]);

  const { businessUnits } = useBusinessUnitsByUser(false, false);
  const { allEconomicGroup } = useEconomicGroup();
  const { reports, loadingReports } = useProductTypesReports(filters, reload);
  const { clinic } = useProfile();

  const listProductsRankingReportPermission = useUserHasPermission("REL07");

  useEffect(() => {
    setFilters({ ...filters, economicGroups: [clinic?.economicGroup?.id] });
  }, [clinic]);

  const componentRef = useRef();

  const handleExport = () => {
    const formatted = reports?.map((item) => ({
      unidade_de_negocios: item?.unit?.identification,
      cidade: item?.unit?.state,
      uf: item?.unit?.city,
      tipo: item?.product?.type,
      descricao_produto_servico: item?.product?.description,
      qtd_vendida: item?.quantity,
      qtd_vendas: item?.sales,
      qtd_clientes: item?.clients,
      valor_vendido_R$: item?.totalValue,
      participacao: `${item?.percentage?.toFixed(2)}%`,
    }));

    let wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(formatted);

    XLSX.utils.book_append_sheet(wb, ws, "Pág " + "1");

    XLSX.writeFile(wb, "ranking-vendas" + ".xlsx");
  };

  return !listProductsRankingReportPermission ||
    listProductsRankingReportPermission === "loading" ? (
    <AccessDenied loading={listProductsRankingReportPermission} />
  ) : (
    <PageWrapper title="Ranking de Produtos/Serviços">
      <Container>
        <section className="uk-margin-small-top uk-flex uk-flex-around">
          <InputBox className="uk-width-1-3">
            <label>Período de venda:</label>
            <DatePicker
              value={filters?.fromDate}
              onChange={(val) => setFilters({ ...filters, fromDate: val })}
              slotProps={{ textField: { variant: "standard" } }}
            />{" "}
            à{" "}
            <DatePicker
              slotProps={{ textField: { variant: "standard" } }}
              value={filters?.toDate}
              onChange={(val) => setFilters({ ...filters, toDate: val })}
            />
          </InputBox>
          <InputBox className="uk-width-1-4">
            <label>Status: </label>
            <Select
              className="uk-width-1-1"
              value={filters?.status}
              onChange={(val) => {
                if (val === "all") {
                  const newObj = { ...filters };
                  delete newObj?.status;
                  return setFilters(newObj);
                }
                setFilters({ ...filters, status: val });
              }}
            >
              <Option value="all">Todas</Option>
              <Option value="ABERTAS">Abertas</Option>
              <Option value="BAIXADAS">Baixadas</Option>
            </Select>
          </InputBox>
          <InputBox className="uk-width-1-5">
            <label>Unidade:</label>
            <Select
              mode="multiple"
              className="uk-width-1-1"
              value={filters?.businessUnits}
              onChange={(val) => setFilters({ ...filters, businessUnits: val })}
            >
              {businessUnits?.map((unit) => (
                <Option value={unit?.id}>{unit?.identification}</Option>
              ))}
            </Select>
          </InputBox>
        </section>
        <section className="uk-margin-small-top uk-flex uk-flex-around">
          <InputBox className="uk-width-1-5">
            <label>Tipo</label>
            <Select
              className="uk-width-1-1"
              value={filters?.type}
              onChange={(val) => {
                if (val === "all") {
                  const newObj = { ...filters };
                  delete newObj?.type;
                  return setFilters(newObj);
                }
                setFilters({ ...filters, type: val });
              }}
            >
              <Option value="all">Todos</Option>
              <Option value="Produto">Produto</Option>
              <Option value="Servico">Serviço</Option>
            </Select>
          </InputBox>
        </section>
        <hr className="" />
        <div style={{ display: "none" }}>
          <div ref={componentRef}>
            <PrintTable data={reports} loading={loadingReports} />
          </div>
        </div>
        <div className="uk-flex-around uk-flex">
          <ReactToPrint
            trigger={() => (
              <Button
                className=""
                onMouseOver={() => {
                  setReload((prv) => !prv);
                }}
              >
                Imprimir
              </Button>
            )}
            content={() => componentRef.current}
          />
          <Button
            onClick={handleExport}
            onMouseOver={() => {
              setReload((prv) => !prv);
            }}
          >
            Exportar (Excel)
          </Button>
        </div>
      </Container>
    </PageWrapper>
  );
}
