import { useState, useRef, useCallback } from "react";

import { Container, InputBox } from "./styles";
import { Select, Button } from "antd";
import PrintTable from "./PrintTable";
import AccessDenied from "@/OLD/components/AccessDenied";
import { PageWrapper } from "infinity-forge";

import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx/xlsx.mjs";

const { Option } = Select;

import { PermissionItem, useQuery } from "@/presentation";
import { reportsService } from "@/OLD/services/reports.service";
import { useSubgroups } from "@/OLD/hooks/useSubgroup";
import { sub } from "date-fns";

export function ProductStockReport() {
  const [filters, setFilters] = useState<Record<string, string | string[]>>({});

  const componentRef = useRef<HTMLDivElement>(null);

  const reportContext = useQuery({
    queryKey: ["product-stock-report", filters],
    queryFn: () =>
      reportsService.getProductStockReport(filters).then((r) => r.data),
  });

  const { subgroups } = useSubgroups(false);

  const handleExport = useCallback(async () => {
    if (!reportContext.data || reportContext.data.length === 0) {
      return;
    }

    const allDepositsMap = new Map<number, string>();
    reportContext.data.forEach((item) => {
      item.deposits.forEach((dep) => {
        allDepositsMap.set(dep.id, dep.description);
      });
    });

    const allDeposits = Array.from(allDepositsMap.entries()).map(
      ([id, description]) => ({
        id,
        description,
      }),
    );

    const formatted = reportContext.data.map((item) => {
      const total = item.deposits.reduce((acc, dep) => acc + dep.quantity, 0);
      const depositQuantities: Record<string, number> = {};

      allDeposits.forEach((dep) => {
        const found = item.deposits.find((d) => d.id === dep.id);
        depositQuantities[dep.description] = found ? found.quantity : 0;
      });

      return {
        Produto: item.productDescription,
        Subgrupo: item.subgroupDescription,
        ...depositQuantities,
        Total: total,
      };
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(formatted);

    XLSX.utils.book_append_sheet(wb, ws, "Estoque");
    XLSX.writeFile(wb, "estoque-produtos.xlsx");
  }, [reportContext.data]);

  const imprimir = useReactToPrint({ contentRef: componentRef });

  return (
    <PermissionItem
      hash="REL07"
      DaniedComponent={() => <AccessDenied loading={false} />}
    >
      <PageWrapper title="Ranking de Produtos/Serviços">
        <Container>
          <section className="uk-margin-small-top uk-flex uk-flex-around">
            <InputBox className="uk-width-1-2">
              <label htmlFor="active">Subgrupos: </label>
              <Select
                className="uk-width-1-1"
                mode="multiple"
                allowClear
                defaultValue={filters?.subgrups ?? []}
                onChange={(val) => {
                  setFilters({ ...filters, subgroups: val });
                }}
              >
                {subgroups?.map((sub) => (
                  <Option key={sub.id} value={sub.id}>
                    {sub.description}
                  </Option>
                ))}
              </Select>
            </InputBox>

            <InputBox className="uk-width-1-2">
              <label htmlFor="active">Status: </label>
              <Select
                className="uk-width-1-1"
                value={filters?.active}
                onChange={(val) => {
                  if (val === "all") {
                    const newObj = { ...filters };
                    delete newObj?.active;
                    return setFilters(newObj);
                  }
                  setFilters({ ...filters, active: val });
                }}
              >
                <Option value="all">Todas</Option>
                <Option value="Ativas">Ativos</Option>
                <Option value="Inativas">Inativos</Option>
              </Select>
            </InputBox>
          </section>

          <hr className="" />

          <div style={{ display: "none" }}>
            <div ref={componentRef}>
              <PrintTable
                data={reportContext?.data ?? []}
                loading={reportContext.isLoading}
              />
            </div>
          </div>

          <div className="uk-flex-around uk-flex">
            <Button
              className=""
              onClick={async () => {
                imprimir();
              }}
              disabled={reportContext.isLoading}
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
