import { useRef } from "react";

import { Button, Empty } from "antd";
import * as XLSX from "xlsx/xlsx.mjs";
import ReactToPrint from "react-to-print";

import { PrintHeader } from "@/presentation";
import { useProfile } from "@/OLD/hooks/useProfile";
import { currencyFormatter } from "@/OLD/components/Budget";

import { Container } from "./styles";

const PrintTable = function PrintTable({
  reports,
  filters,
  setFilters,
  setReload,
}: any) {
  const { clinic } = useProfile();

  const componentRef = useRef();

  const handleExport = () => {
    const formatted = reports?.map((item) => ({
      unidade_de_negocios: item?.unit?.identification,
    }));

    let wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(formatted);

    XLSX.utils.book_append_sheet(wb, ws, "Pág " + "1");

    XLSX.writeFile(wb, "orcamentos" + ".xlsx");
  };

  return (
    <>
      <div style={{ display: "none" }}>
        <Container ref={componentRef as any} className="uk-margin-small-top">
          <div className="uk-text-center">
            <h4 className="">Relatório de entrada analitico</h4>
          </div>
          <div className="clinic-header">
            <PrintHeader />
          </div>
          <div className="table-section">
            <div className="uk-flex content-box uk-flex-around">
              <div>Unidade</div>
              <div>Cidade</div>
              <div>uf</div>
              <div>data entrada</div>
              <div>codigo entrada</div>
              <div>valor total</div>
              <div>valor pgto lancado</div>
              <div>origem lancamento</div>
              <div>status</div>
              <div>fornecedor</div>
            </div>
            {reports?.length > 0 ? (
              <section className="table-box">
                {reports?.length > 0 &&
                  reports?.map((item) => (
                    <div className="uk-margin-top">
                      <div className="uk-flex content-box uk-flex-around">
                        <div> {item?.unit?.identification} </div>
                        <div> {item?.city} </div>
                        <div> {item?.state} </div>
                        <div> [verificar] </div>
                        <div> {currencyFormatter(item?.productValue)} </div>
                        <div> {currencyFormatter(item?.paidValue)} </div>
                        <div> [verificar] </div>
                        <div> {item?.status} </div>
                        <div> {item?.supplier?.name} </div>
                      </div>
                      <div className="uk-flex content-box uk-flex-around">
                        <div>Item</div>
                        <div>Qtd</div>
                        <div>R$ Custo</div>
                        <div>R$ Unitário</div>
                        <div>R$ Desconto</div>
                        <div>R$ Total</div>
                      </div>
                      {item?.items.map((product) => (
                        <div className="uk-flex content-box uk-flex-around">
                          <div> {product?.product?.description} </div>
                          <div> {product?.quantity} </div>
                          <div> {currencyFormatter(product?.costValue)} </div>
                          <div> [verificar] </div>
                          <div>
                            {" "}
                            {currencyFormatter(product?.discountValue)}{" "}
                          </div>
                          <div> {currencyFormatter(product?.totalValue)} </div>
                        </div>
                      ))}
                    </div>
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
      </div>
      <div className="uk-margin-top uk-flex uk-flex-center">
        <ReactToPrint
          onBeforeGetContent={() => {
            setFilters((prv) => ({ ...prv, noSearch: false }));
            setReload((prv) => !prv);
          }}
          trigger={() => (
            <Button className="uk-margin-small-right">Imprimir</Button>
          )}
          content={() => (componentRef as any).current}
        />
      </div>
    </>
  );
}

export default PrintTable;
