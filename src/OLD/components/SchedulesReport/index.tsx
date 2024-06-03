// @ts-nocheck
import { memo, useState, useEffect } from "react";

import { useScheduleReports } from "@/OLD/hooks/useReports";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Container } from "./styles";
import { useProfile } from "@/OLD/hooks/useProfile";
import PrintTable from "./PrintTable";
import Filters from "./Filters";
import AccessDenied from "@/OLD/components/AccessDenied";

const SchedulesReport = memo(function SchedulesReport() {
  const [filters, setFilters] = useState({ noSearch: true });
  const [values, setValues] = useState({});
  const [reload, setReload] = useState(false);

  const { clinic } = useProfile();

  const listSchedulesReportPermission = useUserHasPermission("REL08");

  useEffect(() => {
    setFilters({ ...filters, economicGroups: clinic?.economicGroup?.id });
  }, [clinic]);

  const { reports } = useScheduleReports(filters, reload);

  return !listSchedulesReportPermission ||
    listSchedulesReportPermission === "loading" ? (
    <AccessDenied loading={listSchedulesReportPermission} />
  ) : (
    <Container className="uk-padding">
      <h3 className="uk-margin-remove">Relatório de agendamentos</h3>
      <Filters
        filters={filters}
        setFilters={setFilters}
        values={values}
        setValues={setValues}
        setReload={setReload}
      />
      <PrintTable
        schedules={reports}
        filters={filters}
        values={values}
        setReload={setReload}
        setFilters={setFilters}
      />
    </Container>
  );
});

export default SchedulesReport;
