// @ts-nocheck
import { memo, useState, useRef, useEffect } from "react";

import { useSalesAnalyticsReport } from "@/OLD/hooks/useReports";
import { useProfile } from "@/OLD/hooks/useProfile";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import ReactToPrint from "react-to-print";
import { Container } from "./styles";
import Filters from "./Filters";
import PrintScreen from "./PrintScreen";
import AccessDenied from "@/OLD/components/AccessDenied";
import { Button } from "antd";

const AnalyticalReport = memo(function () {
  const [filters, setFilters] = useState({});
  const [reload, setReload] = useState(false);

  const { clinic } = useProfile();
  const { reports, loadingReports } = useSalesAnalyticsReport(filters, reload);

  const listAnalyticsReportsPermission = useUserHasPermission("REL06");

  useEffect(() => {
    setFilters({ ...filters, economicGroups: [clinic?.economicGroup?.id] });
  }, [clinic]);

  const componentRef = useRef();

  return !listAnalyticsReportsPermission ||
    listAnalyticsReportsPermission === "loading" ? (
    <AccessDenied loading={listAnalyticsReportsPermission} />
  ) : (
    <Container className="uk-padding">
      <h3 className="uk-margin-remove">Relatório de vendas analítico</h3>
      <Filters filters={filters} setFilters={setFilters} />
      <hr />
      <div className="uk-flex uk-flex-around">
        <ReactToPrint
          trigger={() => (
            <Button className="uk-margin-small-right">Imprimir</Button>
          )}
          content={() => componentRef.current}
          onBeforePrint={() => setReload(!reload)}
        />
      </div>
      <div style={{ display: "none" }}>
        <div ref={componentRef}>
          {reports?.length > 0 && <PrintScreen data={reports} />}
        </div>
      </div>
    </Container>
  );
});

export default AnalyticalReport;
