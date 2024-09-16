// @ts-nocheck
import { memo, useState } from "react";

import { useCashierRegimeReports } from "@/OLD/hooks/useReports";

import { Container } from "./styles";
import Filters from "./Filters";
import PrintTable from "./PrintTable";
import { PageWrapper } from "infinity-forge";

const CashierRegimeReport = memo(function () {
  const [filters, setFilters] = useState({ noSearch: true });
  const [reload, setReload] = useState(false);

  const { reports, loadingReports } = useCashierRegimeReports(filters, reload);

  return (
    <PageWrapper title="Regime de Caixa">
      <Container>
        <Filters
          filters={filters}
          setFilters={setFilters}
          setReload={setReload}
        />
        <hr />
        <PrintTable data={reports} loading={loadingReports} />
      </Container>
    </PageWrapper>
  );
});

export default CashierRegimeReport;
