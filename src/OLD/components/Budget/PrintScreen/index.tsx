// @ts-nocheck
import React from "react";

import { useProfile } from "@/OLD/hooks/useProfile";
import { useCompleteBudget } from "@/OLD/hooks/useBudgets";

import { PrintHeader } from "@/presentation";

import * as S from "./styles";

import moment from "moment";
import { currencyFormatter } from "..";
import { useDictionary } from "@/presentation";

export default function PrintScreen({ printDetails, budgetData }: any) {
  const { clinic } = useProfile();

  const { getWord } = useDictionary();

  const budget =
    printDetails?.origin !== "show"
      ? useCompleteBudget(printDetails?.budgetId, printDetails?.hookEnable)
      : { data: budgetData };

  return (
    <S.PrintScreen className="uk-container">
      <hr />
      <PrintHeader />
      <section className="uk-margin-top uk-flex uk-flex-around">
        <div>
          <label>Cod. {getWord("Orçamento")}</label>
          <p className="ukk-margin-remove">{budget?.data?.tag}</p>
        </div>
        <div>
          <label>Cliente</label>
          <p className="ukk-margin-remove">
            {budget?.data?.client?.name || budget?.data?.client_name}
          </p>
        </div>

        <div>
          <label>Data {getWord("Orçamento")}</label>
          <p className="ukk-margin-remove">
            {moment(budget?.data?.budget_date).format("DD/MM/YYYY - HH:mm")}
          </p>
        </div>
        <div>
          <label>Data validade</label>
          <p className="ukk-margin-remove">
            {moment(budget?.data?.expiration_date).format("DD/MM/YYYY - HH:mm")}
          </p>
        </div>
        <div>
          <label>Status</label>
          <p className="ukk-margin-remove">
            {budget?.data?.status.toLowerCase()}
          </p>
        </div>
        {process.env.client !== "liftone" && (
          <div>
            <label>Paciente</label>
            <p className="ukk-margin-remove">{budget?.data?.patient?.name}</p>
          </div>
        )}
      </section>
      <h4 className="uk-margin-top uk-text-center">
        <strong>Itens confirmados</strong>
      </h4>
      <section>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Descrição</th>
              <th>Quantidade</th>
              <th>R$ Unitário</th>
              <th>R$ Desconto</th>
              <th>R$ Total</th>
            </tr>
          </thead>
          <tbody>
            {budget?.data?.items?.map(
              (item) =>
                item?.status === "ABERTO" && (
                  <tr>
                    <td>{item?.productVariation?.product?.reference_code}</td>
                    <td>{item?.productVariation?.product?.description}</td>
                    <td>{item?.quantity}</td>
                    <td>
                      {!item?.courtesy
                        ? currencyFormatter(item?.unitary_value)
                        : currencyFormatter(item?.sale_value)}
                    </td>
                    <td>{currencyFormatter(item?.discount_value)}</td>
                    <td>
                      {!item?.courtesy
                        ? currencyFormatter(item?.total_value)
                        : `${currencyFormatter(0)} (Cortesia)`}
                    </td>
                  </tr>
                )
            )}
            <tr>
              <td style={{ paddingTop: "20px" }}>
                <strong>Total confirmados:&nbsp;</strong>
              </td>
              <td></td>
              <td></td>
              <td style={{ paddingTop: "20px" }}>
                {" "}
                {currencyFormatter(
                  budget?.data?.items?.reduce(
                    (acc, current) =>
                      current?.status === "ABERTO"
                        ? !current?.courtesy
                          ? acc + current?.total_value + current?.discount_value
                          : acc + current?.sale_value
                        : acc,

                    0
                  )
                )}
              </td>
              <td style={{ paddingTop: "20px" }}>
                {currencyFormatter(
                  budget?.data?.items?.reduce(
                    (acc, current) =>
                      current?.status === "ABERTO"
                        ? acc + current?.discount_value
                        : acc,
                    0
                  )
                )}
              </td>
              <td style={{ paddingTop: "20px" }}>
                {" "}
                {currencyFormatter(
                  budget?.data?.items?.reduce(
                    (acc, current) =>
                      current?.status === "ABERTO"
                        ? acc + current?.total_value
                        : acc,
                    0
                  )
                )}
              </td>
            </tr>
            {budget?.data?.items?.find(
              (item) => item?.status === "ABERTO" && item?.courtesy
            ) && (
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  Total de Cortesias:
                  {currencyFormatter(
                    budget?.data?.items?.reduce(
                      (acc, current) =>
                        current?.status === "ABERTO" && current?.courtesy
                          ? acc + current?.sale_value
                          : acc,
                      0
                    )
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
      <hr />
      {printDetails?.complete && (
        <>
          <h4 className="uk-margin-top uk-text-center">
            <strong>Itens não confirmados</strong>
          </h4>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Descrição</th>
                <th>Quantidade</th>
                <th>R$ Unitário</th>
                <th>R$ Desconto</th>
                <th>R$ Total</th>
              </tr>
            </thead>
            <tbody>
              {budget?.data?.items?.map(
                (item) =>
                  item?.status !== "ABERTO" && (
                    <tr>
                      <td>{item?.productVariation?.product?.reference_code}</td>
                      <td>{item?.productVariation?.product?.description}</td>
                      <td>{item?.quantity}</td>
                      <td>
                        {!item?.courtesy
                          ? currencyFormatter(item?.unitary_value)
                          : currencyFormatter(item?.sale_value)}
                      </td>
                      <td>{currencyFormatter(item?.discount_value)}</td>
                      <td>
                        {!item?.courtesy
                          ? currencyFormatter(item?.total_value)
                          : `${currencyFormatter(
                              item?.sale_value * item?.quantity
                            )} (Cortesia)`}
                      </td>
                    </tr>
                  )
              )}
              <tr>
                <td style={{ paddingTop: "20px" }}>
                  <strong>Totais não confirmados:&nbsp;</strong>
                </td>
                <td></td>
                <td></td>
                <td style={{ paddingTop: "20px" }}>
                  {currencyFormatter(
                    budget?.data?.items?.reduce(
                      (acc, current) =>
                        current?.status !== "ABERTO"
                          ? !current?.courtesy
                            ? acc +
                              current?.total_value +
                              current?.discount_value
                            : acc + current?.sale_value
                          : acc,
                      0
                    )
                  )}
                </td>
                <td style={{ paddingTop: "20px" }}>
                  {" "}
                  {currencyFormatter(
                    budget?.data?.items?.reduce(
                      (acc, current) =>
                        current?.status !== "ABERTO"
                          ? acc + current?.discount_value
                          : acc,
                      0
                    )
                  )}
                </td>
              </tr>
              {budget?.data?.items?.find(
                (item) => item?.status !== "ABERTO" && item?.courtesy
              ) && (
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    Total de Cortesias:
                    {currencyFormatter(
                      budget?.data?.items?.reduce(
                        (acc, current) =>
                          current?.status !== "ABERTO" && current?.courtesy
                            ? acc + current?.sale_value
                            : acc,
                        0
                      )
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <hr />
        </>
      )}
      {budget?.data?.payments?.length > 0 && (
        <>
          <h4 className="uk-margin-top uk-text-center">
            <strong>Previa de pagamentos</strong>
          </h4>
          <table>
            <thead>
              <tr>
                <th>Descrição </th>
                <th>Parcelas</th>
                <th>Valor total</th>
              </tr>
            </thead>
            {budget?.data?.payments?.map((payment) => (
              <tbody>
                <tr>
                  <td>{payment?.paymentMethod?.description}</td>
                  <td>{payment?.installments}</td>
                  <td>{currencyFormatter(payment?.total_value)}</td>
                </tr>
              </tbody>
            ))}
          </table>
        </>
      )}
      {budget?.data?.status !== "ABERTO" && printDetails?.complete && (
        <section>
          <h4 className="uk-margin-top uk-text-center">
            <strong>Motivo Cancelamento / Confirmação Parcial</strong>
          </h4>
        </section>
      )}
    </S.PrintScreen>
  );
}
