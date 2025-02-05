// @ts-nocheck
import { memo, useRef, useState } from "react";

import { useProfile } from "@/OLD/hooks/useProfile";
import { useAuth } from "@/OLD/hooks/useAuth";

import { Button, Empty } from "antd";
import { Container, RowBox } from "./styles";
import { PrintHeader } from "@/presentation";

import ReactToPrint, { useReactToPrint } from "react-to-print";
import { currencyFormatter } from "@/OLD/components/Budget";
import moment from "moment";
import * as XLSX from "xlsx/xlsx.mjs";

function PrintTable({ reports, filters }) {
  const { clinic } = useProfile();

  const componentRef = useRef();

  const handleExport = () => {
    const formatted = reports?.map((item) => ({
      unidade: item?.identification,
      cidade: item?.city,
      uf: item?.state,
      data_entrada: moment(item?.receipt_date).format("DD/MM/YYYY"),
      codigo_entrada: item?.tag,
      valor_total: item?.product?.value,
      valor_pgto_lancado: item?.paid_value,
      origem: item?.origin,
      status: item?.status,
      fornecedor: item?.name,
    }));

    let wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(formatted);

    XLSX.utils.book_append_sheet(wb, ws, "Pág " + "1");

    XLSX.writeFile(wb, "Relatorio_entrada" + ".xlsx");
  };

  const imprimir = useReactToPrint({ contentRef: componentRef });

  return (
    <>
      <Container ref={componentRef} className="uk-margin-small-top">
        <div className="clinic-header">
          <PrintHeader />
          <div className="uk-text-center">
            <h4 className="">Notas de entrada</h4>
          </div>
        </div>
        <div className="table-section">
          <section className="header-table">
            <div>Unidade</div>
            <div>Cidade</div>
            <div>Uf</div>
            <div>Data Entrada</div>
            <div>Codigo entrada</div>
            <div>Valor total</div>
            <div>Valor pgto lançado</div>
            <div>Orig. lançamento</div>
            <div>Status</div>
            <div>Fornecedor</div>
          </section>{" "}
          {reports?.length > 0 ? (
            <section className="table-box">
              {reports?.length > 0 &&
                reports?.map((item) => (
                  <RowBox>
                    <div>{item?.identification}</div>
                    <div>{item?.city}</div>
                    <div>{item?.state}</div>
                    <div>{moment(item?.receipt_date).format("DD/MM/YYYY")}</div>
                    <div> {item?.tag} </div>
                    <div> {currencyFormatter(item?.product?.value)} </div>
                    <div> {currencyFormatter(item?.paid_value)} </div>
                    <div> {item?.origin} </div>
                    <div> {item?.status} </div>
                    <div> {item?.name} </div>
                  </RowBox>
                ))}
            </section>
          ) : (
            <div className="uk-padding">
              <Empty />
            </div>
          )}
        </div>
        <section className="uk-margin-top uk-flex uk-flex-center"></section>
      </Container>
      <div className="uk-margin-top uk-flex uk-flex-right">
        <Button
          className="uk-margin-small-right"
          onClick={() => handleExport()}
        >
          Exportar (Excel)
        </Button>

        <Button className="uk-margin-small-right" onClick={() => imprimir()}>
          Imprimir
        </Button>
      </div>
    </>
  );
}

export default PrintTable;
