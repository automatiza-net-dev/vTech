// @ts-nocheck
import { memo, useState } from "react";

import { useAnaliticalReceiptsReport } from "@/OLD/hooks/useReports";
import { useEconomicGroup } from "@/OLD/hooks/useEconomicGroup";

import { Button } from "antd";
import { Container } from "./styles";
import Filters from "./Filters";
import PrintTable from "./PrintTable";
import { PageWrapper } from "infinity-forge";

const AnaliticalReceiptsReport = memo(function BuySuggestionReport() {
  const { economicGroup } = useEconomicGroup();

  const [filters, setFilters] = useState({
    noSearch: true,
    economicGroups: economicGroup,
  });
  const [reload, setReload] = useState(false);

  const { reports } = useAnaliticalReceiptsReport(filters, reload);

  return (
    <PageWrapper title="Relatório de vendas analítico">
      <Container>
        <Filters filters={filters} setFilters={setFilters} />
        <hr />
        <div>
          <PrintTable
            reports={reports}
            filters={filters}
            setFilters={setFilters}
            setReload={setReload}
          />
        </div>
      </Container>
    </PageWrapper>
  );
});

export default AnaliticalReceiptsReport;
