// @ts-nocheck
import { memo, useState } from "react";

import { useAnaliticalReceiptsReport } from "@/OLD/hooks/useReports";
import { useEconomicGroup } from "@/OLD/hooks/useEconomicGroup";

import { Button } from "antd";
import { Container } from "./styles";
import Filters from "./Filters";
import PrintTable from "./PrintTable";

const AnaliticalReceiptsReport = memo(function BuySuggestionReport() {
  const { economicGroup } = useEconomicGroup();

  const [filters, setFilters] = useState({
    noSearch: true,
    economicGroups: economicGroup
  });
  const [reload, setReload] = useState(false);

  const { reports } = useAnaliticalReceiptsReport(filters, reload);

  return (
    <Container className="uk-padding">
      <h2 className="uk-margin-remove">Relatório de vendas analítico</h2>
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
  );
});

export default AnaliticalReceiptsReport;
