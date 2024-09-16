// @ts-nocheck
import { memo, useState } from "react";

import { useCompetenceReports } from "@/OLD/hooks/useReports";

import { Container } from "./styles";
import Filters from "./Filters";
import PrintTable from "./PrintTable";
import { PageWrapper } from "infinity-forge";

const competencyReport = memo(function competencyReport() {
  const [filters, setFilters] = useState({ noSearch: true });
  const [reload, setReload] = useState(false);

  const { reports, loadingReports } = useCompetenceReports(filters, reload);

  return (
    <PageWrapper title="Regime de Competência">
      <Container>
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
    </PageWrapper>
  );
});

export default competencyReport;
