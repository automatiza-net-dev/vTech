// @ts-nocheck
import { memo, useState, useEffect } from "react";

import { Container } from "./styles";
import Filters from "./Filters";
import PrintTable from "./PrintTable";
import AccessDenied from "@/OLD/components/AccessDenied";

import { useQuery } from "infinity-forge";
import { reportsService } from "@/OLD/services/reports.service";
import { usePatients } from "@/OLD/hooks/usePatients";
import { useTutor } from "@/OLD/hooks/useTutor";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { PageWrapper } from "infinity-forge";

import moment from "moment";

const SalesReport = memo(function SalesReport() {
  const [filters, setFilters] = useState({ unit: null });
  const [canSearch, setCanSearch] = useState(false);

  const { tutors } = useTutor(false, false);
  const { patients } = usePatients(false, false);

  const convertString = () => {
    let newObj = { ...filters };
    if (filters?.fromDate) {
      newObj = {
        ...filters,
        fromDate: typeof filters?.formDate === "string" ?  filters?.formDate : moment(filters?.fromDate || new Date()).startOf("day").format("YYYY-MM-DD"),
        toDate: moment(filters?.toDate).endOf("day").format("YYYY-MM-DD"),
      };

      return newObj;
    }
    return newObj;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["reports", "sale", convertString()],
    queryFn: () =>
      reportsService.getSalesReports(convertString()).then((d) => d.data),
    onSuccess: () => {
      setCanSearch(false);
    },
    enabled: canSearch,
    // refetchOnMount: true,
    // refetchOnWindowFocus: false,
    // refetchOnReconnect: false
  });

  const listBillReportPermission = useUserHasPermission("REL03");

  return !listBillReportPermission || listBillReportPermission === "loading" ? (
    <AccessDenied loading={listBillReportPermission} />
  ) : (
    <PageWrapper title="Relatório de vendas">
      <Container>
        <Filters
          loading={isLoading}
          filters={filters}
          setFilters={(f) => {
            setCanSearch(false);
            setFilters(f);
          }}
          tutors={tutors}
          patients={patients}
          search={() => setCanSearch(true)}
        />

        <hr />
        <PrintTable data={data ?? []} loading={isLoading} />
      </Container>
    </PageWrapper>
  );
});

export default SalesReport;
