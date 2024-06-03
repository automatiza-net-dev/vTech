// @ts-nocheck
import { memo, useRef } from "react";

import { useProfile } from "@/OLD/hooks/useProfile";

import { Container, RowBox } from "./styles";
import { Button, Empty } from "antd";
import PrintHeader from "@/OLD/components/mini-components/Print/PrintHeader";

import ReactToPrint from "react-to-print";
import { currencyFormatter } from "@/OLD/components/Budget";
import moment from "moment";
import * as XLSX from "xlsx/xlsx.mjs";

const PrintTable = memo(function PrintTable({ data = [], loading }) {
  const { clinic } = useProfile();


  const componentRef = useRef();

  const handleExport = () => {
    const formatted = data?.map((item) => ({
      mes_competencia: item?.competencia
        ? moment(item?.competencia, "MM/YYYY").format("MM/YYYY")
        : "-",
      data_pagamento: item?.data_pagamento
        ? moment(item?.data_pagamento, "YYYY-MM-DD[T]HH:mm:ss").format(
            "DD/MM/YYYY"
          )
        : "-",
      grupo_plano_contas_PAI: item?.plano_contas_grupo,
      plano_contas: item?.plano_contas,
      num_parcela: item?.parcela,
      item: item?.historico,
      fornecedor: item?.pessoa,
      valor_parcela: item?.valor_pago,
      status: item?.status,
    }));

    let wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(formatted);

    XLSX.utils.book_append_sheet(wb, ws, "Pág " + "1");

    XLSX.writeFile(wb, "regime-caixa" + ".xlsx");
  };

  return (
    <>
      <Container ref={componentRef}>
        <div className="clinic-header">
          <PrintHeader unit={clinic} />
          <div className="uk-text-center">
            <h4 className="">Regime de caixa</h4>
          </div>
        </div>
        <div className="table-section">
          <section className="header-table">
            <div>Mês da competência</div>
            <div>Data Pagamento</div>
            <div>Grupo plano de contas PAI</div>
            <div>Plano de contas</div>
            <div>Num. da parcela</div>
            <div>Item</div>
            <div>Fornecedor</div>
            <div>Valor da parcela</div>
            <div>Status</div>
          </section>
          <section className="table-box">
            {loading ? (
              <div className="uk-text-center">Carregando...</div>
            ) : data?.length > 0 ? (
              data?.map((item) => (
                <RowBox>
                  <div>
                    {item?.competencia
                      ? moment(item?.competencia, "MM/YYYY").format("MM/YYYY")
                      : "-"}
                  </div>
                  <div>
                    {item?.data_pagamento
                      ? moment(
                          item?.data_pagamento,
                          "YYYY-MM-DD[T]HH:mm:ss"
                        ).format("DD/MM/YYYY")
                      : "-"}
                  </div>
                  <div>{item?.plano_contas_grupo}</div>
                  <div>{item?.plano_contas}</div>
                  <div>{item?.parcela}</div>
                  <div>{item?.historico}</div>
                  <div>{item?.pessoa}</div>
                  <div>{currencyFormatter(parseInt(item?.valor_pago))}</div>
                  <div>{item?.status}</div>
                </RowBox>
              ))
            ) : (
              <Empty className="uk-margin-top" />
            )}
          </section>
        </div>
      </Container>

      <div className="uk-margin-top uk-flex uk-flex-right">
        <Button
          className="uk-margin-small-right"
          onClick={() => handleExport()}
        >
          Exportar (Excel)
        </Button>
        <ReactToPrint
          trigger={() => (
            <Button className="uk-margin-small-right">Imprimir</Button>
          )}
          content={() => componentRef.current}
        />
      </div>
    </>
  );
});

export default PrintTable;
