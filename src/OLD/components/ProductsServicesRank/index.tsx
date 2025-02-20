import { useState, useRef, useEffect } from "react";

import { useBusinessUnitsByUser } from "@/OLD/hooks/useBusinessUnits";
import { useProfile } from "@/OLD/hooks/useProfile";

import { Container, InputBox } from "./styles";
import { Select, Button } from "antd";
import { DatePicker } from "@mui/x-date-pickers";
import PrintTable from "./PrintScreen";
import AccessDenied from "@/OLD/components/AccessDenied";
import { api, PageWrapper } from "infinity-forge";

import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx/xlsx.mjs";
import moment from "moment";

const { Option } = Select;

import { PermissionItem } from "@/presentation";

export function ProductsServicesRank() {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState<any>({});

  const { businessUnits } = useBusinessUnitsByUser(false, false);

  const { clinic } = useProfile();

  useEffect(() => {
    setFilters({ ...filters, economicGroups: [clinic?.economicGroup?.id] });
  }, [clinic]);

  const componentRef = useRef<HTMLDivElement>(null);

  async function getReports() {
    try {
      const keys = Object.keys(filters);
      let newObj = { ...filters };

      if (keys.includes("fromDate")) {
        newObj = {
          ...newObj,
          fromDate: moment(filters?.fromDate)
            .startOf("day")
            .format("YYYY-MM-DD"),
          toDate: moment(filters.toDate).endOf("day").format("YYYY-MM-DD"),
        };
      }

      const reports = await api({
        url: "reports/product-types",
        method: "get",
        body: newObj
      });

      setReports(reports);

      return reports;
    } catch (err) {
      return [];
    }
  }

  const handleExport = async () => {
    const reports = await getReports();

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

  const imprimir = useReactToPrint({ contentRef: componentRef });

  return (
    <PermissionItem
      hash="REL07"
      DaniedComponent={() => <AccessDenied loading={false} />}
    >
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
                onChange={(val) =>
                  setFilters({ ...filters, businessUnits: val })
                }
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
              <PrintTable data={reports} loading={false} />
            </div>
          </div>

          <div className="uk-flex-around uk-flex">
            <Button
              className=""
              onClick={async () => {
                await getReports();

                setTimeout(() => {
                  imprimir();
                }, 1000);
              }}
            >
              Imprimir
            </Button>

            <Button onClick={handleExport}>Exportar (Excel)</Button>
          </div>
        </Container>
      </PageWrapper>
    </PermissionItem>
  );
}
