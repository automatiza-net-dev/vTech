import React, { memo, useState } from "react";

import { useProfile } from "@/OLD/hooks/useProfile";

import PrintHeader from "@/OLD/components/mini-components/Print/PrintHeader";

import * as S from "./styles";

import moment from "moment";
import { currencyFormatter } from "@/OLD/components/Budget";

export default function PrintScreen({ bill }: any) {
  const [higherBlock, setHigherBlock] = useState(0);
  const blockArr = Array.from(Array(higherBlock).keys());
  const { clinic } = useProfile();

  let finalValue = 0;
  let totalDiscount = 0;
  let totalValue = 0;

  bill?.items.forEach((item) => {
    finalValue += item?.total_value || 0;
    totalDiscount += item?.discount_value || 0;
    totalValue += item?.saleValue || 0;
  });

  bill?.payments?.map((item) => {
    if (item?.block > higherBlock) {
      setHigherBlock(item?.block);
    }
  });

  return (
    <S.PrintScreen>
      <PrintHeader unit={clinic} />
      <hr />
      <section className="uk-flex uk-flex-around uk-margin-top">
        <div>
          <label>Cliente</label>
          <p className="uk-margin-remove">{bill?.client?.name}</p>
        </div>
        <div>
          <label>Código</label>
          <p className="uk-margin-remove">{bill?.tag}</p>
        </div>
        <div>
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
        {process.env.client !== "liftone" && (
          <div>
            <label>Paciente</label>
            <p className="uk-margin-remove">{bill?.patient?.name}</p>
          </div>
        )}
      </section>
      <hr />
      <h4 className="uk-margin-top uk-text-center">
        <strong>Itens</strong>
      </h4>
      <section className="uk-flex uk-flex-around">
        <div>
          <label>Código</label>
          {bill?.items.map((item) => (
            <p className="uk-margin-remove uk-text-center">
              {item?.productVariation?.product?.reference_code}
            </p>
          ))}
        </div>
        <div>
          <label>Descrição</label>
          {bill?.items.map((item) => (
            <p className="uk-margin-remove uk-text-left">
              {item?.productVariation?.product?.description}
            </p>
          ))}
        </div>
        <div>
          <label>Qtd.</label>
          {bill?.items.map((item) => (
            <p className="uk-margin-remove uk-text-center">{item?.quantity}</p>
          ))}
        </div>
        <div>
          <label>R$ Unit.</label>
          {bill?.items.map((item) => (
            <p className="uk-margin-remove uk-text-center">
              {currencyFormatter(item?.unitary_value)}
            </p>
          ))}
        </div>
        <div>
          <label>R$ Desc.</label>
          {bill?.items.map((item) => (
            <p className="uk-margin-remove uk-text-center">
              {currencyFormatter(item?.total_value - item?.sale_value)}
            </p>
          ))}
        </div>
        <div>
          <label>R$ Total</label>
          {bill?.items.map((item) => (
            <p className="uk-margin-remove uk-text-center">
              {currencyFormatter(item?.total_value)}
            </p>
          ))}
        </div>
      </section>
      <hr />
      <h4 className="uk-margin-top uk-text-center">
        <strong>Total</strong>
      </h4>
      <section className="uk-flex uk-flex-around">
        <div>
          <label>Valor Total</label>
          <p className="uk-margin-remove uk-text-center">
            {currencyFormatter(totalValue)}
          </p>
        </div>
        <div>
          <label>Descontos totais</label>
          <p className="uk-margin-remove uk-text-center">
            {currencyFormatter(totalDiscount)}
          </p>
        </div>
        <div>
          <label>Valor Final</label>
          <p className="uk-margin-remove uk-text-center">
            {currencyFormatter(finalValue)}
          </p>
        </div>
        {/* <div className="uk-flex uk-flex-around">
        <h5 className="uk-margin-top uk-text-bold"> Total </h5>
        <p className="uk-margin-top uk-text-right">{totalValue}</p>
        <p className="uk-margin-top uk-text-right">{totalDiscount}</p>
        <p className="uk-margin-top uk-text-right">{finalValue}</p>
      </div> */}
      </section>

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
                {payments[0]?.paymentMethod?.description}&nbsp;-&nbsp;
                {payments[0]?.flag && payments[0]?.flag?.description}
              </p>
              <p className="uk-margin-remove uk-text-left uk-width-1-4 ">
                {currencyFormatter(
                  payments.reduce(
                    (acc, current) => acc + current.total_value,
                    0
                  )
                )}
              </p>
              <p className="uk-margin-remove uk-text-left uk-width-1-4">
                {payments?.length} Parcelas
              </p>
            </div>
          );
        })}
      <h4 className="uk-margin-top uk-text-center">
        <strong>Observações</strong>
      </h4>
      <section>{bill?.additional_information}</section>
    </S.PrintScreen>
  );
}
