// @ts-nocheck
import { memo, useRef } from "react";

import { useProfile } from "@/OLD/hooks/useProfile";

import { Container, RowBox } from "./styles";
import { Button, Empty } from "antd";
import { PrintHeader } from "@/presentation";

import ReactToPrint from "react-to-print";

const PrintTable = memo(function PrintTable({ reports }) {
  const { clinic } = useProfile();


  const componentRef = useRef();

  const handleExport = () => {
    const formatted = reports?.map((item) =>
      item?.products.map((product) => ({
        identificacao: item?.identification,
        descricao: product?.description,
        estoque_minimo: product?.minimumStock,
        estoque_maximo: product?.maximumStock,
        quantidade_atual: product?.qtyStock,
        suggestao_compra: product?.suggestion,
      }))
    );

    let wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(formatted[0]);

    XLSX.utils.book_append_sheet(wb, ws, "Pág " + "1");

    XLSX.writeFile(wb, "suggestao_compra" + ".xlsx");
  };

  return (
    <>
      <Container ref={componentRef} className="uk-margin-small-top">
        <div className="clinic-header">
          <PrintHeader />
          <div className="uk-text-center">
            <h4 className="">Sugestão de compras</h4>
          </div>
        </div>
        <div className="table-section">
          <section className="header-table">
            <div>Unidade</div>
            <div>Descrição produto</div>
            <div>Estoque minimo</div>
            <div>Estoque maximo</div>
            <div>Qtd atual estoque</div>
            <div>Qtd sugerida compra</div>
          </section>{" "}
          {reports?.length > 0 ? (
            <section className="table-box">
              {reports?.length > 0 &&
                reports?.map((item) =>
                  item?.products?.map((product) => (
                    <RowBox>
                      <div>{item?.identification}</div>
                      <div>{product?.description} </div>
                      <div> {product?.minimumStock} </div>
                      <div> {product?.maximumStock} </div>
                      <div> {product?.qtyStock} </div>
                      <div> {product?.suggestion} </div>
                    </RowBox>
                  ))
                )}
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
