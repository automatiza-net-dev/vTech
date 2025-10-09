import { PageWrapper, useQuery } from "infinity-forge";
import { memo, useState } from "react";
import Filters from "./Filters";
import PrintTable from "./PrintTable";
import { Container } from "./styles";
import { reportsService } from "@/OLD/services/reports.service";

const FiscalDocumentReport = memo(function FiscalDocumentReport() {
  const [filters, setFilters] = useState({ noSearch: false });

  const reportQuery = useQuery({
    queryKey: ["fiscal-document-report", filters],
    enabled: !filters.noSearch,
    queryFn: () =>
      reportsService.getFiscalDocumentReport(filters).then((r) => r.data),
  });

  return (
    <PageWrapper title={`Relatório de notas emitidas`}>
      <Container>
        <Filters filters={filters} setFilters={setFilters} />
        <PrintTable reports={reportQuery.data ?? []} />
      </Container>
    </PageWrapper>
  );
});

export default FiscalDocumentReport;
