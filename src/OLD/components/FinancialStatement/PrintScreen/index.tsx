// @ts-nocheck
import { memo, useRef } from "react";

import { useProfile } from "@/OLD/hooks/useProfile";

import { Container, RowBox } from "./styles";
import { Empty } from "antd";
import { PrintHeader } from "@/presentation";

import { currencyFormatter } from "@/OLD/components/Budget";
import moment from "moment";

function PrintTable({ data = [], loading }) {
  const { clinic } = useProfile();

  return (
    <>
      <Container>
        <div className="clinic-header">
          <PrintHeader />
          <div className="uk-text-center">
            <h4 className="">Relatório de vendas</h4>
          </div>
        </div>
        <div className="table-section">
          <section className="header-table">
            <div>Doc</div>
            <div>Parc</div>
            <div>nota fiscal</div>
            <div>pessoa</div>
            <div>emissao</div>
            <div>valor</div>
            <div>Comp.</div>
            <div>Dt Venc.</div>
            <div>vlr pago</div>
            <div>forma pgto</div>
            <div>Comprov./NSU</div>
            <div>Conf.</div>
          </section>
          <section className="table-box">
            {loading ? (
              <div className="uk-text-center">Carregando...</div>
            ) : data?.length > 0 ? (
              data?.map((item) => (
                <RowBox>
                  <div>{item?.document}</div>
                  <div>{`${item?.installment} / ${item?.qty_installments}`}</div>
                  <div>{item?.fiscal_note}</div>
                  <div>{item?.client}</div>
                  <div>
                    {item?.issue_date
                      ? moment(item?.issue_date).format("DD/MM/YYYY")
                      : "-"}
                  </div>
                  <div>{currencyFormatter(item?.value)}</div>
                  <div>{item?.competence_date ?? '-'}</div>
                  <div>
                    {item?.expiration_date
                      ? moment(item?.expiration_date).format("DD/MM/YYYY")
                      : "-"}
                  </div>
                  <div>
                    {item?.payment_value
                      ? currencyFormatter(item?.payment_value)
                      : "-"}
                  </div>
                  <div>{item.payment_method}</div>
                  <div>
                    {item?.payment_date
                      ? moment(item?.payment_date).format("DD/MM/YYYY")
                      : "-"}
                  </div>
                  <div>{item?.paymentMethod?.description}</div>
                  <div>{item?.nsu_document || "-"}</div>
                </RowBox>
              ))
            ) : (
              <Empty className="uk-margin-top" />
            )}
          </section>
        </div>
      </Container>
    </>
  );
}

export default PrintTable;
