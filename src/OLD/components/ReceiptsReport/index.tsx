// @ts-nocheck
import { memo, useState } from "react";

import { useReceiptsReport } from "@/OLD/hooks/useReports";

import { Container } from "./styles";
import { Button, notification } from "antd";
import Filters from "./Filters";

import PrintTable from "./PrintTable";

const ReceiptsReports = memo(function ReceiptsReports() {
  const [filters, setFilters] = useState({ noSearch: true });
  const [reload, setReload] = useState([]);

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
              return notification.warning({
                message: "Informe pelo menos uma unidade"
              });
            }

            if (!filters?.fromDate) {
              return notification.warning({ message: "informe o período" });
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
