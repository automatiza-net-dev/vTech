import { memo, useState, useRef, useEffect } from "react";

import { reportsService } from "@/OLD/services/reports.service";
import { useProfile } from "@/OLD/hooks/useProfile";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { useReactToPrint } from "react-to-print";
import { Container } from "./styles";
import Filters from "./Filters";
import PrintScreen from "./PrintScreen";
import AccessDenied from "@/OLD/components/AccessDenied";
import { Button } from "antd";
import { PageWrapper, useQuery } from "infinity-forge";
import moment from "moment";

const AnalyticalReport = memo(function () {
  const [filters, setFilters] = useState({});

  const { clinic } = useProfile();

  const reportsQuery = useQuery({
    queryKey: ["RemoteSalesAnalyticsReport", filters],
    queryFn: () => {
      const keys = Object.keys(filters);
      let newObj = { ...filters };

      if (keys.includes("fromDate")) {
        newObj = {
          ...newObj,
          // @ts-ignore
          fromDate: moment(filters?.fromDate).format("YYYY-MM-DD"),
          // @ts-ignore
          toDate: moment(filters.toDate).format("YYYY-MM-DD"),
        };
      }

      return reportsService.getSaleAnalyticsReport(newObj).then((d) => d.data);
    },
  });

  const listAnalyticsReportsPermission = useUserHasPermission("REL06");

  useEffect(() => {
    setFilters({ ...filters, economicGroups: [clinic?.economicGroup?.id] });
  }, [clinic]);

  const componentRef = useRef(null);

  const imprimir = useReactToPrint({
    contentRef: componentRef,
  });

  return !listAnalyticsReportsPermission ||
    listAnalyticsReportsPermission === "loading" ? (
    <AccessDenied loading={listAnalyticsReportsPermission} />
  ) : (
    <PageWrapper title="Relatório de vendas analítico">
      <Container>
        <Filters filters={filters} setFilters={setFilters} />
        <hr />
        <div className="uk-flex uk-flex-around">
          <Button
            className="uk-margin-small-right"
            onClick={() => {
              imprimir();
            }}
            disabled={reportsQuery.isLoading}
          >
            {reportsQuery.isLoading ? "Carregando..." : "Imprimir"}
          </Button>
        </div>
        <div style={{ display: "none" }}>
          <div ref={componentRef}>
            <PrintScreen data={reportsQuery?.data ?? []} />
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
});

export default AnalyticalReport;
