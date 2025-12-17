import { memo, useState, useRef, useEffect } from "react";

import { useSalesAnalyticsReport } from "@/OLD/hooks/useReports";
import { useProfile } from "@/OLD/hooks/useProfile";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import ReactToPrint, { useReactToPrint } from "react-to-print";
import { Container } from "./styles";
import Filters from "./Filters";
import PrintScreen from "./PrintScreen";
import AccessDenied from "@/OLD/components/AccessDenied";
import { Button } from "antd";
import { PageWrapper } from "infinity-forge";

const AnalyticalReport = memo(function () {
  const [filters, setFilters] = useState({});
  const [reload, setReload] = useState(false);

  const { clinic } = useProfile();
  const { reports, loadingReports } = useSalesAnalyticsReport(filters, reload);

  const listAnalyticsReportsPermission = useUserHasPermission("REL06");

  useEffect(() => {
    setFilters({ ...filters, economicGroups: [clinic?.economicGroup?.id] });
  }, [clinic]);

  const componentRef = useRef(null);

  const imprimir = useReactToPrint({
    contentRef: componentRef,
    onBeforePrint: async () => {
      setReload(!reload);
      // Wait for data to load before printing
      await new Promise((resolve) => {
        const checkLoading = () => {
          if (!loadingReports) {
            resolve(true);
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
      });
    },
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
          >
            {loadingReports
              ? "Carregando..."
              : reports?.length
                ? "Imprimir"
                : "Sem dados"}
          </Button>
        </div>
        <div style={{ display: "none" }}>
          <div ref={componentRef}>
            {reports?.length > 0 && <PrintScreen data={reports} />}
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
});

export default AnalyticalReport;
