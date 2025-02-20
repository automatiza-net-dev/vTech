// @ts-nocheck
import { memo, useState } from "react";

import { useReceiptsReport } from "@/OLD/hooks/useReports";

import { Container } from "./styles";
import { Button } from "antd";
import Filters from "./Filters";

import PrintTable from "./PrintTable";
import { useToast } from "infinity-forge";

const ReceiptsReports = memo(function ReceiptsReports() {
  const [filters, setFilters] = useState({ noSearch: true });
  const [reload, setReload] = useState([]);
  const { createToast } = useToast();

  const { reports } = useReceiptsReport(filters, reload);

  return (
    <Container className="uk-padding">
      <h2 className="uk-margin-remove">Relatório de notas de entrada</h2>
      <Filters filters={filters} setFilters={setFilters} />
      <div className="uk-flex uk-flex-right">
        <Button
          type="primary"
          className="uk-margin-small-top"
          onClick={() => {
            if (!filters?.businessUnit) {
              createToast({
                message: "Informe pelo menos uma unidade",
                status: "warning",
              });

              return;
            }

            if (!filters?.fromDate) {
              createToast({ message: "informe o período", status: "warning" });
              return;
            }
            setFilters((prv) => ({ ...prv, noSearch: false }));
            setReload((prv) => !prv);
          }}
        >
          Filtrar
        </Button>
      </div>
      <hr />
      <PrintTable fitlers={filters} reports={reports} />
    </Container>
  );
});

export default ReceiptsReports;
