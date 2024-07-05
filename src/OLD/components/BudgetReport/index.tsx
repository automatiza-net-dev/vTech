// @ts-nocheck
import { memo, useState } from "react";

import { useBudgetReport } from "@/OLD/hooks/useReports";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Container } from "./styles";
import PrintTable from "./PrintTable";
import Filters from "./Filters";
import AccessDenied from "@/OLD/components/AccessDenied";
import { useDictionary } from "@/presentation";

const BudgetReport = memo(function BudgetReport() {
  const [filters, setFilters] = useState({ noSearch: true });
  const [values, setValues] = useState({});
  const [reload, setReload] = useState(false);

  const { reports } = useBudgetReport(filters, reload);

  const {getWord} = useDictionary()

  const listBudgetsReportPermission = useUserHasPermission("REL05");

  return !listBudgetsReportPermission ||
    listBudgetsReportPermission === "loading" ? (
    <AccessDenied loading={listBudgetsReportPermission} />
  ) : (
    <Container className="uk-padding">
      <h3 className="uk-margin-remove">Relatório {getWord("Orçamentos")}</h3>
      <Filters
        filters={filters}
        setFilters={setFilters}
        values={values}
        setValues={setValues}
        setReload={setReload}
      />
      <PrintTable reports={reports} filters={filters} values={values} />
    </Container>
  );
});

export default BudgetReport;
