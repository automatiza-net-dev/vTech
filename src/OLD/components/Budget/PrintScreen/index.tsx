// @ts-nocheck
import React  from "react";

import { useProfile } from "@/OLD/hooks/useProfile";

import PrintHeader from "@/OLD/components/mini-components/Print/PrintHeader";

import * as S from "./styles";

import moment from "moment";
import { currencyFormatter } from "..";

export default  function PrintScreen({ budget }) {
  const { clinic } = useProfile();


  return (
    <S.PrintScreen className="uk-container">
      <hr />
      <PrintHeader unit={clinic} />
      <section className="uk-margin-top uk-flex uk-flex-around">
        <div>
          <label>Cod. orçamento</label>
          <p className="ukk-margin-remove">{budget?.tag}</p>
        </div>
        <div>
          <label>Cliente</label>
          <p className="ukk-margin-remove">{budget?.client_name}</p>
        </div>

        <div>
          <label>Data orçamento</label>
          <p className="ukk-margin-remove">
            {moment(budget?.budget_date).format("DD/MM/YYYY - HH:mm")}
          </p>
        </div>
        <div>
          <label>Data validade</label>
          <p className="ukk-margin-remove">
            {moment(budget?.expiration_date).format("DD/MM/YYYY - HH:mm")}
          </p>
        </div>
        <div>
          <label>Status</label>
          <p className="ukk-margin-remove">{budget?.status.toLowerCase()}</p>
        </div>
        {process.env.client !== "liftone" && (
          <div>
            <label>Paciente</label>
            <p className="ukk-margin-remove">{budget?.patient?.name}</p>
          </div>
        )}
      </section>
      <h4 className="uk-margin-top uk-text-center">
        <strong>Items confirmados</strong>
      </h4>
      <section>
        <div className="uk-flex uk-flex-around uk-width-1-1">
          <p className="uk-margin-remove uk-width-1-7">Código</p>
          <p className="uk-margin-remove uk-width-1-1">Descrição</p>
          <p className="uk-margin-remove uk-width-1-1">Quantidade</p>
          <p className="uk-margin-remove uk-width-1-7">R$ Unitário</p>
          <p className="uk-margin-remove uk-width-1-7 ">R$ Desconto</p>
          <p className="uk-margin-remove uk-width-1-7">R$ Total</p>
        </div>
        {budget?.items.map(
          (item) =>
            item?.status === "ABERTO" && (
              <div className="uk-flex uk-flex-around uk-width-1-1 uk-margin-small-top">
                <p className="uk-margin-remove uk-width-1-7">
                  {item?.productVariation?.product?.reference_code}
                </p>
                <p className="uk-margin-remove uk-width-1-1">
                  {item?.productVariation?.product?.description}
                </p>
                <p className="uk-margin-remove uk-width-1-1 uk-flex uk-flex-center">
                  {item?.quantity}
                </p>
                <p className="uk-margin-remove uk-width-1-7">
                  {currencyFormatter(item?.unitary_value)}
                </p>
                <p className="uk-margin-remove uk-width-1-7">
                  {currencyFormatter(item?.discount_value)}
                </p>
                <p className="uk-margin-remove uk-width-1-7">
                  {currencyFormatter(item?.total_value)}
                </p>
              </div>
            )
        )}
        <div className="uk-flex uk-margin-top">
          <div className="uk-margin-remove uk-flex uk-flex-center uk-width-1-1">
            <p className="uk-margin-remove uk-width-1-4">
              <strong>Total confirmados:&nbsp;</strong>
            </p>
            <p className="uk-margin-remove uk-width-1-4">
              {currencyFormatter(
                budget?.items.reduce(
                  (acc, current) =>
                    current?.status === "ABERTO"
                      ? acc + current?.total_value + current?.discount_value
                      : acc,
                  0
                )
              )}
            </p>
            <p className="uk-margin-remove uk-width-1-4">
              {currencyFormatter(
                budget?.items.reduce(
                  (acc, current) =>
                    current?.status === "ABERTO"
                      ? acc + current?.discount_value
                      : acc,
                  0
                )
              )}
            </p>
            <p className="uk-margin-remove uk-width-1-4">
              {currencyFormatter(
                budget?.items.reduce(
                  (acc, current) =>
                    current?.status === "ABERTO"
                      ? acc + current?.total_value
                      : acc,
                  0
                )
              )}
            </p>
          </div>
        </div>
      </section>
      <hr />
      <h4 className="uk-margin-top uk-text-center">
        <strong>Items não confirmados</strong>
      </h4>
      <section>
        <div className="uk-flex uk-flex-around uk-width-1-1">
          <p className="uk-margin-remove uk-width-1-7">Código</p>
          <p className="uk-margin-remove uk-width-1-1">Descrição</p>
          <p className="uk-margin-remove uk-width-1-1">Quantidade</p>
          <p className="uk-margin-remove uk-width-1-7">R$ Unitário</p>
          <p className="uk-margin-remove uk-width-1-7 ">R$ Desconto</p>
          <p className="uk-margin-remove uk-width-1-7">R$ Total</p>
        </div>
        {budget?.items.map(
          (item) =>
            item?.status !== "ABERTO" && (
              <div className="uk-flex uk-flex-around uk-width-1-1 uk-margin-small-top">
                <p className="uk-margin-remove uk-width-1-7">
                  {item?.productVariation?.product?.reference_code}
                </p>
                <p className="uk-margin-remove uk-width-1-1">
                  {item?.productVariation?.product?.description}
                </p>
                <p className="uk-margin-remove uk-width-1-1 uk-flex uk-flex-center">
                  {item?.quantity}
                </p>
                <p className="uk-margin-remove uk-width-1-7">
                  {currencyFormatter(item?.unitary_value)}
                </p>
                <p className="uk-margin-remove uk-width-1-7">
                  {currencyFormatter(item?.discount_value)}
                </p>
                <p className="uk-margin-remove uk-width-1-7">
                  {currencyFormatter(item?.total_value)}
                </p>
              </div>
            )
        )}
        <div className="uk-flex uk-flex-right uk-margin-top">
          <div className="uk-margin-remove uk-flex uk-flex-center uk-width-1-1">
            <p className="uk-margin-remove uk-width-1-4">
              <strong>Totais não confirmados:&nbsp;</strong>
            </p>
            <p className="uk-margin-remove uk-width-1-4">
              {currencyFormatter(
                budget?.items.reduce(
                  (acc, current) =>
                    current?.status !== "ABERTO"
                      ? acc + current?.total_value + current?.discount_value
                      : acc,
                  0
                )
              )}
            </p>
            <p className="uk-margin-remove uk-width-1-4">
              {currencyFormatter(
                budget?.items.reduce(
                  (acc, current) =>
                    current?.status !== "ABERTO"
                      ? acc + current?.discount_value
                      : acc,
                  0
                )
              )}
            </p>
            <p className="uk-margin-remove uk-width-1-4">
              {currencyFormatter(
                budget?.items.reduce(
                  (acc, current) =>
                    current?.status !== "ABERTO"
                      ? acc + current?.total_value
                      : acc,
                  0
                )
              )}
            </p>
          </div>
        </div>
      </section>
      <hr />
      <section>
        <h4 className="uk-margin-top uk-text-center">
          <strong>Motivo Cancelamento / Confirmação Parcial</strong>
        </h4>
      </section>
    </S.PrintScreen>
  );
}
