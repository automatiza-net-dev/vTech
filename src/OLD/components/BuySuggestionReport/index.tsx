// @ts-nocheck
import { memo, useState } from "react";

import { useBuySuggestionReport } from "@/OLD/hooks/useReports";
import { useEconomicGroup } from "@/OLD/hooks/useEconomicGroup";

import { Button } from "antd";
import { Container } from "./styles";
import Filters from "./Filters";
import PrintTable from "./PrintTable";

const BuySuggestionReport = memo(function BuySuggestionReport() {
  const { economicGroup } = useEconomicGroup();

  const [filters, setFilters] = useState({
    noSearch: true
  });
  const [reload, setReload] = useState(false);

  const { reports } = useBuySuggestionReport(filters, reload);

  return (
    <Container className="uk-padding">
      <h2 className="uk-margin-remove">Sugestão de compra</h2>
      <Filters filters={filters} setFilters={setFilters} />
      <div className="uk-flex uk-flex-right">
        <Button
          type="primary"
          onClick={() => {
            setFilters((prv) => ({
              ...prv,
              noSearch: false,
              economic_group_id: economicGroup
            }));
            setReload((prv) => !prv);
          }}
        >
          Filtrar
        </Button>
      </div>
      <hr />
      <PrintTable reports={reports} filters={filters} />
    </Container>
  );
});

export default BuySuggestionReport;
