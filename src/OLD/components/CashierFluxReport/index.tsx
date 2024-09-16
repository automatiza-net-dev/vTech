// @ts-nocheck
import { memo, useState, useEffect } from "react";

import {
  useFlowReports,
  useExpiredReports,
  useCheckingAccountReports,
} from "@/OLD/hooks/useReports";
import { useProfile } from "@/OLD/hooks/useProfile";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Container } from "./styles";
import Filters from "./Filters";
import PrintTable from "./PrintTable";
import AccessDenied from "@/OLD/components/AccessDenied";
import { PageWrapper } from "infinity-forge";

import moment from "moment";

function FinancesReport() {
  const { clinic } = useProfile();

  const [filters, setFilters] = useState({
    fromDate: moment().startOf("month"),
    toDate: moment().endOf("month"),
    businessUnit: clinic?.id,
    noSearch: true,
  });
  const [values, setValues] = useState({});
  const [reload, setReload] = useState(false);
  const [formatedReports, setFormatedReports] = useState([]);

  const { flowReports } = useFlowReports(filters, reload);
  const { checkingAccountReports } = useCheckingAccountReports(filters, reload);
  const { expiredReports } = useExpiredReports(filters, reload);

  const listCashierFluxPermission = useUserHasPermission("REL02");

  const formatValues = () => {
    const arr = [];
    flowReports?.length > 0 &&
      flowReports[0]?.flow.map((report, i) => {
        const period = Object.keys(report)[0];
        let initialValue =
          i === 0 ? checkingAccountReports[0]?.total : arr[i - 1]?.finalBalance;
        arr.push({
          period: moment(period).format("DD/MM/YYYY"),
          initialValue: initialValue,
          credit: report[period]?.credit,
          debit: report[period]?.debit,
          dayBalance: report[period]?.credit - report[period]?.debit,
          finalBalance:
            initialValue + report[period]?.credit - report[period]?.debit,
        });
      });
    setFormatedReports(arr);
  };

  useEffect(() => {
    flowReports?.length > 0 ? formatValues() : setFormatedReports([]);
  }, [flowReports]);

  return !listCashierFluxPermission ||
    listCashierFluxPermission === "loading" ? (
    <AccessDenied loading={listCashierFluxPermission} />
  ) : (
    <PageWrapper title="Relatório de fluxo de caixa">
      <Container>
        <Filters
          filters={filters}
          setFilters={setFilters}
          setReload={setReload}
          setValues={setValues}
        />
        <hr />
        <PrintTable
          reports={{
            flowReports: [...formatedReports],
            checkingAccountReports,
            expiredReports,
          }}
          filters={filters}
          values={values}
        />
      </Container>
    </PageWrapper>
  );
}

export default FinancesReport;
