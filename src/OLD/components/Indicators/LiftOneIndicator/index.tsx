// @ts-nocheck
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import {
  useMedianTicket,
  useInvoicingNewClients,
  useClientOrigin,
  useInvoicingPaymentMethod,
  useInvoicingSubgroups,
  useResumeSchedulings,
  useUnconfirmedBudgets,
  useSalesTypes,
  useAvgInstallmentsSales,
  useProductTypeSubgroup,
  useSubgroupsTree,
  useBudgetsByStatus,
} from "@/OLD/hooks/useIndicators";
import { useProfile } from "@/OLD/hooks/useProfile";

import { Container } from "./styles";
import { Table, DatePicker, Tooltip, Modal } from "antd";
import { LoadingPage } from "@/OLD/components/mini-components/LoadingPage";

import "swiper/css";
import "swiper/css/navigation";

import moment from "moment";
import { currencyFormatter } from "@/OLD/components/Budget";

import InvFunnel from "../InvFunnel";
import BudgetsTable from "../BudgetsByType";

const Pie = dynamic(() => import("../Pie"), { ssr: false });

const valuesControl = ["dawn", "morning", "afternoon", "night"];

const labelControl = {
  dawn: "Madrugada (0h - 8h)",
  morning: "Manhã (8h - 12h)",
  afternoon: "Tarde (12h - 18h)",
  night: "Noite (18h - 24h)",
};

const subgroupDetailsColumns = [
  { title: "Produto/Serviço", key: "product", dataIndex: "description" },
  { title: "Qtd Vendas", key: "qtySales", dataIndex: "qtySales" },
  {
    title: "R$ Venda",
    key: "value",
    dataIndex: "totalSales",
    render: (record) => currencyFormatter(record),
  },
  {
    title: "% Partic",
    key: "percentage",
    dataIndex: "percentage",
    render: (record) => record.toFixed(2),
  },
];

function Indicators() {
  const { clinic } = useProfile();
  const [filters, setFilters] = useState({
    units: clinic?.id,
    fromDate: moment().startOf("month"),
    toDate: moment().endOf("month"),
  });
  const [subgroupDetailsFilters, setSubgroupDetailsFilters] = useState({
    units: clinic?.id,
    fromDate: moment().startOf("month"),
    toDate: moment().endOf("month"),
  });
  const [subgroupDetailsVisible, setSubgroupDetailsVisible] = useState(false);

  const { medianTicket } = useMedianTicket(filters);
  const { invoicing } = useInvoicingNewClients(filters);
  const { origins } = useClientOrigin(filters);
  const { methods } = useInvoicingPaymentMethod(filters);
  const { schedulings } = useResumeSchedulings(filters);
  const { subgroupsTree } = useSubgroupsTree(filters);
  const { salesTypes } = useSalesTypes(filters);
  const { installment } = useAvgInstallmentsSales(filters);
  const { subgroupDetails } = useProductTypeSubgroup(subgroupDetailsFilters);
  const { unconfirmedBudgets } = useUnconfirmedBudgets(filters);

  const systemName = process.env.clientName;

  return (
    <section className="uk-width-1-1">
      <div className="uk-flex uk-flex-right uk-margin-right">
        <div className="">
          <label>Mês:</label>
          <DatePicker
            className="uk-width-1-1"
            format="MM/YYYY"
            picker="month"
            value={filters?.fromDate}
            onChange={(val) => {
              setFilters({
                ...filters,
                fromDate: moment(val)?.startOf("month"),
                toDate: moment(val)?.endOf("month"),
              });
              setSubgroupDetailsFilters((prv) => ({
                ...prv,
                fromDate: moment(val)?.startOf("month"),
                toDate: moment(val)?.endOf("month"),
              }));
            }}
          />
        </div>
      </div>
      <Container host={systemName}>
        <div className="uk-margin-small-top uk-flex uk-flex-around uk-width-1-1">
          <div>
            <div className="custom-bordered">
              <h4 className="uk-margin-remove">Fat. X Forma de pag.</h4>
              <div
                className="pie-chart"
                style={{ width: "400px", height: "300px" }}
              >
                {methods.length && (
                  <Pie
                    marginLeft={-200}
                    translateX={-150}
                    translateY={0}
                    direction="column"
                    data={methods?.map((mtd, i) => ({
                      id: `${mtd?.description} - ${currencyFormatter(
                        mtd?.totalSales
                      )}`,
                      arcLinkLabel:
                        currencyFormatter(mtd?.totalSales.toFixed(2)) || 0,
                      label: `${mtd?.description} - ${currencyFormatter(
                        mtd?.totalSales
                      )}`,
                      value: mtd?.percentage.toFixed(2),
                    }))}
                  />
                )}
              </div>
            </div>
            <div className="custom-bordered uk-margin-small-top">
              <h4 className="uk-margin-remove">Clientes Novos x Recorrentes</h4>
              <div
                className="pie-chart"
                style={{ width: "400px", height: "300px" }}
              >
                {invoicing?.length > 0 && (
                  <Pie
                    marginLeft={-200}
                    translateY={0}
                    translateX={-150}
                    direction="column"
                    data={[
                      {
                        id: `Novos - ${currencyFormatter(
                          invoicing[0]?.new?.total
                        )}`,
                        arcLinkLabel: currencyFormatter(
                          invoicing[0]?.new?.total
                        ),
                        label: `Novos Clientes -
                        ${currencyFormatter(invoicing[0]?.new?.total)}`,
                        value:
                          (
                            (invoicing[0]?.new?.total /
                              (invoicing[0]?.new?.total +
                                invoicing[0]?.recurrent?.total)) *
                            100
                          ).toFixed(2) || 0,
                      },
                      {
                        id: `Recorr. - ${currencyFormatter(
                          invoicing[0]?.recurrent?.total
                        )}`,
                        arcLinkLabel: currencyFormatter(
                          invoicing[0]?.recurrent?.total
                        ),
                        label: `Recorrentes - ${currencyFormatter(
                          invoicing[0]?.recurrent?.total
                        )}`,
                        value: (
                          (invoicing[0]?.recurrent?.total /
                            (invoicing[0]?.new?.total +
                              invoicing[0]?.recurrent?.total)) *
                            100 || 0
                        ).toFixed(2),
                      },
                    ]}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="">
            <div className="custom-bordered">
              <h4 className="">Fat. x Origem Clientes</h4>
              <div style={{ width: "400", height: "280px" }}>
                {origins?.length && (
                  <Pie
                    marginLeft={-200}
                    translateY={0}
                    translateX={-150}
                    direction="column"
                    color="paired"
                    data={origins
                      ?.sort((a, b) => {
                        if (a?.totalPayments < b?.totalPayments) {
                          return 1;
                        }
                        if (a?.totalPayments > b?.totalPayments) {
                          return -1;
                        }
                        return 0;
                      })
                      .map((origin, i) => {
                        const total = origins?.reduce(
                          (acc, item) => acc + item.total,
                          0
                        );
                        const percentage = (
                          (origin?.total / total) *
                          100
                        ).toFixed(2);
                        return {
                          id: `${origin?.description} - ${currencyFormatter(
                            origin?.total
                          )}`,
                          label: `${origin?.description} - ${currencyFormatter(
                            origin?.total
                          )}`,
                          value: percentage,
                          arcLinkLabel: currencyFormatter(origin?.total),
                        };
                      })}
                  />
                )}
              </div>
            </div>

            <div className="custom-bordered uk-margin-small-top">
              <h4 className="">Resumo Agendamentos</h4>
              <div style={{ width: "400px", height: "200px" }}>
                {schedulings && (
                  <InvFunnel
                    data={[
                      {
                        id: 1,
                        label: "Agendadas",
                        value: schedulings[0]?.scheduled || 0,
                      },
                      {
                        id: 2,
                        label: "Atendidas",
                        value: schedulings[0]?.attended || 0,
                        conversionPercentage: `${(
                          (schedulings[0]?.attended /
                            schedulings[0]?.scheduled) *
                            100 || 0
                        )?.toFixed(2)}%`,
                      },
                      {
                        id: 3,
                        label: "Vendidas",
                        value: schedulings[0]?.clients || 0,
                        conversionPercentage: `${(
                          (schedulings[0]?.clients / schedulings[0]?.attended) *
                            100 || 0
                        )?.toFixed(2)}%`,
                      },
                    ]}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="uk-width-1-5">
            <div>
              <div className="general-box">
                Faturamento realizado:
                <h4 className="uk-margin-remove uk-flex uk-flex-right">
                  {currencyFormatter(medianTicket?.salesTotal || 0)}
                </h4>
                <hr className="uk-margin-remove" />
                <div className="uk-text-right">
                  {/*
                  {billing[0]?.meta?.description !== "SemMetaDefinida"
                    ? currencyFormatter(billing[0]?.meta?.value)
                    : "-"}{" "}
                  De meta
                  <br />
                  {billing[0]?.meta?.description !== "SemMetaDefinida"
                    ? `${
                      billing[0]?.percentage > 0
                          ? billing[0]?.percentage
                              ?.toFixed(2)
                              ?.replace(".", ",")
                          : "0"
                      }%`
                    : "-"} Sobre a meta
                    */}
                  {salesTypes?.length > 0 && (
                    <>
                      {(
                        (salesTypes[0]?.cash /
                          (salesTypes[0]?.cash + salesTypes[0]?.installment)) *
                        100
                      ).toFixed(0)}
                      % De vendas a vista
                    </>
                  )}
                  <br />
                  {installment && installment?.length > 0 && (
                    <>
                      {installment[0]?.avgInstallment?.toFixed(0)}x Parcelamento
                      médio
                    </>
                  )}
                  <br />
                  {/*
                  {currencyFormatter(
                    medianTicket?.salesTotal / medianTicket?.qtySales || 0
                  )}
                  &nbsp;(
                    {medianTicket?.qtySales}) Tkt médio vendas
                  <br />
                  */}
                  {currencyFormatter(
                    medianTicket?.salesTotal / medianTicket?.qtyClients || 0
                  )}
                  &nbsp;(
                  {medianTicket?.qtyClients}) Tkt médio clientes
                </div>
              </div>
              {/*
              <div className="uk-margin-small-top general-box">
                <div style={{ fontSize: "0.7em" }}>Tendência</div>
                <h4 className="uk-margin-remove uk-flex uk-flex-right">
                  {billing[0]?.meta?.description !== "SemMetaDefinida"
                    ? `${
                        billing[0]?.metaProjection
                          ? billing[0]?.metaProjection
                              ?.toFixed(2)
                              ?.replace(".", ",")
                          : 0
                      }% / ${currencyFormatter(billing[0]?.projection)}`
                    : currencyFormatter(billing[0]?.projection)}
                </h4>
              </div>
              */}
              <div
                className="general-box uk-margin-small-top"
                style={{ fontSize: "0.7em" }}
              >
                <div className="uk-flex uk-flex-around uk-text-center">
                  <div style={{ width: "50%" }}>Fatur. Grupo / serviço</div>
                  <div style={{ width: "10%" }}>Qtde:</div>
                  <div style={{ width: "30%" }}>Valor:</div>
                  <div style={{ width: "10%" }}>(%):</div>
                </div>
                {subgroupsTree?.length > 0 &&
                  subgroupsTree.map((item) => (
                    <div className="uk-margin-small-top">
                      <div className="uk-flex uk-flex-around">
                        <div style={{ width: "50%" }}>
                          <strong>{item?.description}</strong>
                        </div>
                        <div style={{ width: "10%" }}>
                          <strong>{item?.quantity}</strong>
                        </div>
                        <div style={{ width: "30%" }}>
                          <strong>{currencyFormatter(item?.total)} </strong>
                        </div>
                        <div style={{ width: "10%" }}>
                          <strong>{item?.percentage.toFixed(0)}%</strong>
                        </div>
                      </div>
                      {item?.children?.map((item) => (
                        <div className="uk-flex uk-flex-around">
                          <div style={{ width: "50%" }}>
                            {item?.description}
                          </div>
                          <div style={{ width: "10%" }}>{item?.quantity}</div>
                          <div style={{ width: "30%" }}>
                            {currencyFormatter(item?.total)}
                          </div>
                          <div style={{ width: "10%" }}>
                            {item?.percentage.toFixed(0)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
              <div
                className="general-box uk-margin-small-top"
                style={{ fontSize: "0.7em" }}
              >
                Orçamentos não confirmados
                <h4 className="uk-margin-remove uk-flex uk-flex-right">
                  <h4 className="uk-margin-remove uk-flex uk-flex-right">
                    {currencyFormatter(unconfirmedBudgets[0]?.total || 0)}
                    {' '}
                    {unconfirmedBudgets[0]?.unique &&
                      `(${unconfirmedBudgets[0].unique})`}
                  </h4>
                </h4>
              </div>
              {/*
            {invData && (
              <div
                className="general-box uk-margin-small-top"
                style={{ fontSize: "0.7em" }}
              >
                Retorno Investimento Mkt (ROI)
                <h4 className="uk-margin-remove uk-flex uk-flex-right">
                  {invData[0]?.roi}
                </h4>
              </div>
            )}
            {cost && (
              <div
                className="general-box uk-margin-small-top"
                style={{ fontSize: "0.7em" }}
              >
                Custo aquisição cliente (CAC)
                <h4 className="uk-margin-remove uk-flex uk-flex-right">
                  {currencyFormatter(
                    (cost[0]?.totalFinances / cost[0]?.uniqueClients !== 0
                      ? cost[0]?.uniqueClients
                      : 1
                    ).toFixed(2)
                  )}
                </h4>
              </div>
            )}
            */}
              {/*
              {systemName === "LiftOne" && (
                <>
                  <div>
                    <div>Ticket médio vendas:</div>
                    {currencyFormatter(
                      medianTicket?.salesTotal / medianTicket?.qtySales || 0
                    )}
                    &nbsp;(
                    {medianTicket?.qtySales})
                  </div>
                  {medianTicket?.qtyClients > 0 && (
                    <div>
                      <div>Ticket médio clientes:</div>
                      {currencyFormatter(
                        medianTicket?.salesTotal / medianTicket?.qtyClients || 0
                      )}
                      &nbsp;(
                      {medianTicket?.qtyClients})
                    </div>
                  )}
                </>
              )}
              {systemName === "Sanclá" && (
                <>
                  {medianTicket?.qtyPatients > 0 && (
                    <div>
                      <div>Ticket médio pacientes:</div>
                      {currencyFormatter(
                        medianTicket?.salesTotal / medianTicket?.qtyPatients ||
                          0
                      )}
                      &nbsp;(
                      {medianTicket?.qtyPatients})
                    </div>
                  )}
                </>
              )}
              */}
            </div>
          </div>
        </div>
        <div className="custom-bordered uk-margin-small-top custom-width custom-margin-left">
          <div className="uk-width-1-1 uk-margin-small-right">
            <h4 className="uk-margin-remove">Orçamentos por vendedor</h4>
            <div className="table-container uk-width-1-1">
              <BudgetsTable
                filters={{
                  ...filters,
                  type: "VENDEDOR",
                  units: [clinic?.id],
                  groups: [clinic?.economicGroup?.id],
                }}
              />
            </div>
          </div>
        </div>
        <div className="custom-bordered uk-margin-small-top custom-width custom-margin-left">
          <div className="uk-width-1-1 uk-margin-small-right">
            <h4 className="uk-margin-remove">Orçamentos por avaliador</h4>
            <div className="table-container uk-width-1-1">
              <BudgetsTable
                filters={{
                  ...filters,
                  type: "AVALIADOR",
                  units: [clinic?.id],
                  groups: [clinic?.economicGroup?.id],
                }}
              />
            </div>
          </div>
        </div>
        {subgroupDetailsVisible && (
          <Modal
            title={`Detalhes do subgrupo ${subgroupDetails[0]?.subgroup}`}
            width={800}
            footer={null}
            onCancel={() => {
              setSubgroupDetailsVisible(false);
              setSubgroupDetailsFilters({ ...filters, subgroup: false });
            }}
            visible={subgroupDetailsVisible}
          >
            <Table
              columns={subgroupDetailsColumns}
              setSubgroupDetailsFilters
              dataSource={subgroupDetails}
            />
          </Modal>
        )}
      </Container>
    </section>
  );
}

export default Indicators;
