// @ts-nocheck
import React, { memo, useState, useEffect, useRef } from "react";
import ReactToPrint, { useReactToPrint } from "react-to-print";

import { useQueryClient } from "react-query";

import { currencyFormatter } from "@/OLD/components/Budget";

import { Collapse, Table } from "antd";
import { Button, useAuthAdmin } from "infinity-forge";
import { DatePicker } from "@mui/x-date-pickers";
const { Panel } = Collapse;
import RemoveBillPayment from "../../AddBillPayment/RemoveBillPayment";
import {
  useBillPaymentsReceipts,
  PrintPaymentReceipts,
} from "@/presentation";

import moment from "moment";
import { paymentsColumns } from "./columns";

const ProductsPanel = memo(function ProductsPanel({
  payments,
  remove,
  reload,
  setReload,
  billId,
  bill,
  client,
}) {
  const componentRef = useRef();
  const SinglecomponentRef = useRef();
  const { user } = useAuthAdmin();
  const [singlePayment, setSinglePayment] = useState([]);
  const [formatedPayments, setFormatedPayments] = useState([]);
  const [editExpirationDate, setEditExpirationDate] = useState(false);
  const [billPaymentReceiptsFilters, setBillPaymentReceiptsFilters] = useState({
    fetch: false,
    businessUnitId: user.unit.id,
    billId: bill?.id,
  });

  const [data, setData] = useState([]);

  const billReceipts = useBillPaymentsReceipts(billPaymentReceiptsFilters);
  const queryClient = useQueryClient();

  function formatAuthorization(payment) {
    const { approvedUser, approved_at, pending, approved } = payment;

    if (pending) {
      return "Pendente de Liberação";
    }
    if (!pending && !approved && approved_at !== null) {
      return `Não aprovado por ${approvedUser} em ${moment(approved_at).format(
        "DD/MM/YYYY"
      )}`;
    }

    if (!pending && approved) {
      return `Aprovado por ${approvedUser} em ${moment(approved_at).format(
        "DD/MM/YYYY"
      )}`;
    }

    return "-";
  }

  const imprimir1 = useReactToPrint({ contentRef: SinglecomponentRef })
  const imprimir2 = useReactToPrint({ contentRef: componentRef })

  const formatPayments = () => {
    setFormatedPayments(
      payments?.map((payment, i) => {
        return {
          date: !editExpirationDate ? (
            moment(payment?.expiration_date).format("DD/MM/YYYY")
          ) : (
            <DatePicker
              slotProps={{ textField: { variant: "standard" } }}
              format="DD/MM/YYYY"
              value={
                data?.find((item) => item?.billPaymentId === payment?.id)
                  ?.expirationDate
              }
              onChange={(val) => {
                let newArr = [...data];
                newArr.splice(i, 1, {
                  ...data[i],
                  expirationDate: val,
                });
                setData(newArr);
              }}
            />
          ),
          value: currencyFormatter(payment?.installment_value),
          paymentMethod:
            payment?.paymentMethod?.tef !== "NAO"
              ? `${payment?.paymentMethod?.tef} CARTÃO ${payment?.paymentMethod?.type} - ${payment?.flag?.description}`
              : payment?.paymentMethod?.description,
          nsu: payment?.nsu_document,
          downDate: payment?.finance?.payment_date
            ? moment(payment?.finance?.payment_date).format("DD/MM/YYYY") +
              ` (${payment?.finance?.paymentMethod?.description})`
            : "-",

          authorization: formatAuthorization(payment),
          print: payment?.finance?.payment_date && (
            <div
              onMouseOver={() => {
                queryClient.invalidateQueries(["billPaymentsReceipts"]);
                setBillPaymentReceiptsFilters((prv) => ({
                  ...prv,
                  block: payment.block,
                  billPayment: payment.id,
                  fetch: true,
                }));
              }}
            >
           
<Button text="imprimir" onClick={() => imprimir1()} />
            </div>
          ),
        };
      })
    );
  };

  useEffect(() => {
    setData(
      payments?.map((payment) => ({
        billPaymentId: payment?.id,
        expirationDate: moment(payment?.expiration_date),
      }))
    );
  }, [payments]);

  useEffect(() => {
    payments?.length > 0 && formatPayments();
  }, [payments, editExpirationDate, data]);

  return (
    payments?.length > 0 && (
      <Collapse className="uk-margin-small-top uk-width-1-1">
        <Panel
          header={
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex" }}>
                <div className="uk-margin-right">
                  {payments[0]?.paymentMethod?.description}&nbsp;
                  {payments[0]?.qty_installments > 1 ? "(Parcelado)" : ""}&nbsp;
                  {payments[0]?.flag?.description
                    ? payments[0]?.flag?.description
                    : ""}
                  &nbsp;
                  {payments[0]?.paymentMethod?.type}
                </div>
                <div className="uk-margin-right">
                  {currencyFormatter(
                    payments.reduce(
                      (acc, current) => acc + current.total_value,
                      0
                    )
                  )}
                </div>
                <div>{payments?.length}x</div>
              </div>
              {payments.filter((pay) => !pay?.finance?.payment_date).length !==
                payments.length && (
                <div
                  onMouseOver={() => {
                    queryClient.invalidateQueries(["billPaymentsReceipts"]);
                    setBillPaymentReceiptsFilters((prv) => ({
                      fetch: true,
                      businessUnitId: user.unit.id,
                      billId: bill?.id,
                      block: payments[0]?.block,
                    }));
                  }}
                >
               

<Button text="Imprimir recibo" onClick={() => imprimir2()} />
                </div>
              )}
            </div>
          }
        >
          <>
            {remove ? (
              <RemoveBillPayment
                payments={payments}
                reload={reload}
                setReload={setReload}
                billId={billId}
                setEditExpirationDate={setEditExpirationDate}
                editExpirationDate={editExpirationDate}
                data={data}
              />
            ) : (
              "Venda já finalizada"
            )}
            <Table dataSource={formatedPayments} columns={paymentsColumns} />
          </>
        </Panel>
        <section style={{ display: "none" }}>
          <div ref={componentRef as any}>
            <PrintPaymentReceipts
              bill={bill}
              payments={payments}
              billReceipts={billReceipts.data}
            />
          </div>
        </section>
        <section style={{ display: "none" }}>
          <div ref={SinglecomponentRef as any}>
            <PrintPaymentReceipts
              bill={bill}
              payments={[singlePayment]}
              billReceipts={billReceipts.data}
            />
          </div>
        </section>
      </Collapse>
    )
  );
});

export default ProductsPanel;
