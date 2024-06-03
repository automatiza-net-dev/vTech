// @ts-nocheck
import { memo, useState } from "react";

import { useCompetenceReports } from "@/OLD/hooks/useReports";

import { Container } from "./styles";
import Filters from "./Filters";
import PrintTable from "./PrintTable";

const competencyReport = memo(function competencyReport() {
  const [filters, setFilters] = useState({ noSearch: true });
  const [reload, setReload] = useState(false);

  const { reports, loadingReports } = useCompetenceReports(filters, reload);

  return (
    <Container className="uk-padding">
      <h3 className="uk-margin-remove">Regime de competência</h3>
      <Filters
        filters={filters}
        setFilters={setFilters}
        setReload={setReload}
      />
      <hr />
      <PrintTable
        data={reports}
        loading={loadingReports}
        date={filters?.fromDate}
      />
    </Container>
  );
});

export default competencyReport;
