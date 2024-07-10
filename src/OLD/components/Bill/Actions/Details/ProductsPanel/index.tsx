// @ts-nocheck
import React, { memo, useState, useEffect } from "react";

import { currencyFormatter } from "@/OLD/components/Budget";

import { Collapse, Table } from "antd";
import { Button } from "infinity-forge";
import { DatePicker } from "@mui/x-date-pickers";
const { Panel } = Collapse;
import RemoveBillPayment from "../../AddBillPayment/RemoveBillPayment";

import moment from "moment";
import { paymentsColumns } from "./columns";

const ProductsPanel = memo(function ProductsPanel({
  payments,
  remove,
  reload,
  setReload,
  billId,
  bill,
}) {
  const [formatedPayments, setFormatedPayments] = useState([]);
  const [editExpirationDate, setEditExpirationDate] = useState(false);
  const [data, setData] = useState([]);

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
            ? moment(payment?.finance?.payment_date).format("DD/MM/YYYY")
            : "-",
          print: <Button text="imprimir" />,
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
  }, []);

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
                  {payments[0]?.qty_installments > 0 ? "(Parcelado)" : ""}&nbsp;
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
              <Button text="Imprimir recibo" />
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
      </Collapse>
    )
  );
});

export default ProductsPanel;
