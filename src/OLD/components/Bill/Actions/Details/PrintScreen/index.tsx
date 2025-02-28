import React, { useState } from "react";

import { useProfile } from "@/OLD/hooks/useProfile";

import { PrintHeader } from "@/presentation";

import * as S from "./styles";

import moment from "moment";
import { currencyFormatter } from "@/OLD/components/Budget";
import { useAuthAdmin } from "infinity-forge";
import { Bill } from "@/domain";

export default function PrintScreen({ bill }: { bill: Bill }) {
  const [higherBlock, setHigherBlock] = useState(0);
  const blockArr = Array.from(Array(higherBlock).keys());

  bill?.payments?.map((item) => {
    if (item?.block > higherBlock) {
      setHigherBlock(item?.block);
    }
  });

  const { user } = useAuthAdmin();
  const hasInternalCode = user?.unit?.unitConfig?.internalCode;
  
  return (
    <S.PrintScreen>
      <PrintHeader />

      <hr />
      
      <section className="uk-flex  uk-margin-top" style={{ gap: 20 }}>
        <div style={{ maxWidth: 200 }}>
          <label>Cliente</label>
          <p className="uk-margin-remove">{bill?.client?.name}</p>
        </div>

        {hasInternalCode && (
          <div style={{ maxWidth: 200 }}>
            <label>Código Interno</label>
            <p className="uk-margin-remove">{bill?.internalCode}</p>
          </div>
        )}

        <div style={{ marginRight: 10 }}>
          <label>Código</label>
          <p className="uk-margin-remove">{bill?.tag}</p>
        </div>

        <div style={{ marginRight: 10 }}>
          <label>Data</label>
          <p className="uk-margin-remove">
            {moment(bill?.bill_date).format("DD/MM/YYYY - HH:mm")}
          </p>
        </div>

        <div>
          <label>Status</label>
          <p className="uk-margin-remove">
            {bill?.status == "ABERTA" ? "Aberta" : "Baixada"}
          </p>
        </div>

        {bill?.patient && (
          <div>
            <label>Paciente</label>
            <p className="uk-margin-remove">{bill?.patient?.name}</p>
          </div>
        )}
      </section>

      <hr />

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "center",
          fontSize: "14px",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#f4f4f4",
              borderBottom: "2px solid #ddd",
            }}
          >
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              Código
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              Descrição
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Qtd.</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              R$ Unit.
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              R$ Desc.
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              R$ Total
            </th>
          </tr>
        </thead>

        <tbody>
          {bill?.items?.map((item, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {item?.productVariation?.product?.reference_code}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                }}
              >
                {item?.productVariation?.product?.description}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {item?.quantity}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {currencyFormatter(item?.unitary_value)}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {currencyFormatter(item?.discount_value)}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {currencyFormatter(item?.total_value)}
              </td>
            </tr>
          ))}

          <tr style={{ fontWeight: "bold", backgroundColor: "#f9f9f9" }}>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>Total</td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}></td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}></td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
              <p style={{ margin: 0 }}>{currencyFormatter(bill?.total_value + bill?.discount_value)}</p>
            </td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
              <p style={{ margin: 0 }}>{currencyFormatter(bill?.discount_value)}</p>
            </td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
              <p style={{ margin: 0 }}>{currencyFormatter(bill?.total_value)}</p>
            </td>
          </tr>
        </tbody>
      </table>
      
      <hr />

      <h4 className="uk-margin-top uk-text-center">
        <strong>Pagamentos</strong>
      </h4>

      {blockArr?.length > 0 &&
        blockArr?.map((i) => {
          const payments = bill?.payments?.filter(
            (item) => item?.block === i + 1
          );
          return (
            <div className="uk-flex uk-flex-around">
              <p className="uk-margin-remove uk-text-left uk-width-2-4">
                {payments?.[0]?.paymentMethod?.description}&nbsp;-&nbsp;
                {payments?.[0]?.flag && payments[0]?.flag?.description}
              </p>
              {payments && (
                <p className="uk-margin-remove uk-text-left uk-width-1-4 ">
                  {currencyFormatter(
                    payments?.reduce(
                      (acc, current) => acc + current.total_value,
                      0
                    )
                  )}
                </p>
              )}
              <p className="uk-margin-remove uk-text-left uk-width-1-4">
                {payments?.length} Parcelas
              </p>
            </div>
          );
        })}
      <h4 className="uk-margin-top uk-text-center">
        <strong>Observações</strong>
      </h4>
      <section>{bill?.additionalInformation}</section>
    </S.PrintScreen>
  );
}
