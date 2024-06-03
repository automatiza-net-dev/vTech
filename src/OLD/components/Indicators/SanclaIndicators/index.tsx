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
  useBilling,
  useCrmIndicators,
  useSalesPerPeriod,
  useByTypes,
  useMarketingInvestment,
  useCostAcquisition,
  useSalesTypes,
  useBudgetsByStatus,
  useProductTypeSubgroup
} from "@/OLD/hooks/useIndicators";
import { useProfile } from "@/OLD/hooks/useProfile";

import { Container } from "./styles";
import { Table, DatePicker, Modal } from "antd";
import { LoadingPage } from "@/OLD/components/mini-components/LoadingPage";

import "swiper/css";
import "swiper/css/navigation";

import moment from "moment";
import { currencyFormatter } from "@/OLD/components/Budget";

import InvFunnel from "../InvFunnelSancla";
import InvFunnelCrm from "../InvFunnelCrm";

const Pie = dynamic(() => import("../Pie"), { ssr: false });
// const Bar = dynamic(() => import("../Bars"), { ssr: false });

const valuesControl = ["dawn", "morning", "afternoon", "night"];

const subgroupDetailsColumns = [
  { title: "Produto/Serviço", key: "product", dataIndex: "description" },
  { title: "Qtd Vendas", key: "qtySales", dataIndex: "qtySales" },
  { title: "Qtd Clientes", key: "qtyClients", dataIndex: "qtyClients" },
  {
    title: "R$ Venda",
    key: "value",
    dataIndex: "totalSales",
    render: (record) => currencyFormatter(record)
  },
  {
    title: "% Partic",
    key: "percentage",
    dataIndex: "percentage",
    render: (record) => record.toFixed(2)
  }
];


const labelControl = {
  dawn: "Madrugada (0h - 8h)",
  morning: "Manhã (8h - 12h)",
  afternoon: "Tarde (12h - 18h)",
  night: "Noite (18h - 24h)"
};

function Indicators() {
  const { clinic } = useProfile();
  console.log(clinic, 'alohaaa')
  const [filters, setFilters] = useState({
    units: clinic?.id,
    fromDate: moment().startOf("month"),
    toDate: moment().endOf("month")
  });
  const [subgroupDetailsFilters, setSubgroupDetailsFilters] = useState({
    units: clinic?.id,
    fromDate: moment().startOf("month"),
    toDate: moment().endOf("month")
  });
  const [subgroupDetailsVisible, setSubgroupDetailsVisible] = useState(false);

  const { medianTicket } = useMedianTicket(filters);
  const { invoicing } = useInvoicingNewClients(filters);
  const { origins } = useClientOrigin(filters);
  const { methods } = useInvoicingPaymentMethod(filters);
  const { schedulings } = useResumeSchedulings(filters);
  const { subgroups, loadingSubgroups } = useInvoicingSubgroups(filters);
  const { billing } = useBilling(filters);
  const { crmIndicators } = useCrmIndicators(filters);
  const { sales } = useSalesPerPeriod(filters);
  const { types } = useByTypes(filters);
  const { invData } = useMarketingInvestment(filters);
  const { cost } = useCostAcquisition(filters);
  const { salesTypes } = useSalesTypes(filters);
  const { subgroupDetails } = useProductTypeSubgroup(subgroupDetailsFilters);
  const { budgets: openBudgets } = useBudgetsByStatus(filters, true);
  const { budgets: canceledBudgets } = useBudgetsByStatus(filters, false);
  // const { installment } = useAvgInstallmentsSales(filters);

  const systemName = process.env.clientName;

  return loadingSubgroups ? (
    <div className="uk-flex uk-flex-center uk-flex-middle">
      <LoadingPage />
    </div>
  ) : (
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
                toDate: moment(val)?.endOf("month")
              });
              setSubgroupDetailsFilters((prv) => ({
                ...prv,
                fromDate: moment(val)?.startOf("month"),
                toDate: moment(val)?.endOf("month")
              }));
            }}
          />
        </div>
      </div>
      <Container
        className="uk-margin-small-top uk-flex uk-flex-around uk-width-1-1"
        host={systemName}
      >
        <div className="">
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
                    value: mtd?.percentage.toFixed(2)
                  }))}
                />
              )}
            </div>
            {salesTypes?.length > 0 && (
              <div className="aditional-info">
                A vista: {currencyFormatter(salesTypes[0]?.cash)} -{" "}
                {(
                  (salesTypes[0]?.cash /
                    (salesTypes[0]?.cash + salesTypes[0]?.installment)) *
                  100
                ).toFixed(2)}
                %
                <br />A prazo: {currencyFormatter(
                  salesTypes[0]?.installment
                )} -{" "}
                {(
                  (salesTypes[0]?.installment /
                    (salesTypes[0]?.cash + salesTypes[0]?.installment)) *
                  100
                ).toFixed(2)}
                %
              </div>
            )}
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
                      arcLinkLabel: currencyFormatter(invoicing[0]?.new?.total),
                      label: `Novos Clientes - ${currencyFormatter(
                        invoicing[0]?.new?.total
                      )}`,
                      value:
                        (
                          (invoicing[0]?.new?.total /
                            (invoicing[0]?.new?.total +
                              invoicing[0]?.recurrent?.total)) *
                          100
                        ).toFixed(2) || 0
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
                      ).toFixed(2)
                    }
                  ]}
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
                      value: schedulings[0]?.scheduled || 0
                    },
                    {
                      id: 2,
                      label: "Atendidas",
                      value: schedulings[0]?.attended || 0,
                      conversionPercentage: `${(
                        (schedulings[0]?.attended / schedulings[0]?.scheduled) *
                          100 || 0
                      )?.toFixed(2)}%`
                    },
                    {
                      id: 3,
                      label: "Vendidas",
                      value: schedulings[0]?.sales || 0,
                      conversionPercentage: `${(
                        (schedulings[0]?.sales / schedulings[0]?.attended) *
                          100 || 0
                      )?.toFixed(2)}%`
                    }
                  ]}
                />
              )}
            </div>
          </div>
          <div className="custom-bordered uk-margin-small-top">
            <div className="uk-width-1-1 uk-margin-small-right">
              <h4 className="uk-margin-remove">Faturamento por subgrupo</h4>
              <div className="table-container uk-width-1-1">
                <Table
                  dataSource={subgroups}
                  pagination={false}
                  columns={[
                    {
                      title: "Descrição",
                      key: "description",
                      dataIndex: "description",
                      render: (record, content) => (
                        <span
                          className="uk-link"
                          onClick={() => {
                            setSubgroupDetailsFilters((prv) => ({
                              ...prv,
                              subgroup: content?.subgroupID
                            }));
                            setSubgroupDetailsVisible(true);
                          }}
                        >
                          {record}
                        </span>
                      )
                    },
                    {
                      title: "Qtd",
                      key: "qtd",
                      dataIndex: "quantity"
                    },
                    {
                      title: "Valor Venda",
                      key: "value",
                      dataIndex: "total",
                      render: (record) => currencyFormatter(record)
                    },
                    {
                      title: "%",
                      key: "perc",
                      dataIndex: "percentage",
                      render: (record) => `${record.toFixed(2)}%`
                    }
                  ]}
                />
              </div>
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
                        arcLinkLabel: currencyFormatter(origin?.total)
                      };
                    })}
                />
              )}
            </div>
          </div>
          <div className="custom-bordered uk-margin-small-top">
            <h4 className="">Participação produtos X Serviços</h4>
            <div style={{ width: "400", height: "280px" }}>
              {types && (
                <Pie
                  marginLeft={-200}
                  translateY={0}
                  translateX={-150}
                  direction="column"
                  color="paired"
                  data={[
                    {
                      label: `Produtos - ${currencyFormatter(
                        types[0]?.productsTotal
                      )}`,
                      id: `Produtos - ${currencyFormatter(
                        types[0]?.productsTotal
                      )}`,
                      value: (
                        (types[0]?.productsTotal /
                          (types[0]?.productsTotal + types[0]?.servicesTotal)) *
                        100
                      )?.toFixed(2)
                    },
                    {
                      label: `Serviços - ${currencyFormatter(
                        types[0]?.servicesTotal
                      )}`,
                      id: `Serviços - ${currencyFormatter(
                        types[0]?.servicesTotal
                      )}`,
                      value: (
                        (types[0]?.servicesTotal /
                          (types[0]?.productsTotal + types[0]?.servicesTotal)) *
                        100
                      )?.toFixed(2)
                    }
                  ]}
                />
              )}
            </div>
          </div>
          <div className="custom-bordered uk-margin-small-top">
            <h4>Funil Crm</h4>
            <div style={{ width: "450px", height: "200px" }}>
              <InvFunnelCrm
                data={[
                  {
                    label: "Novas Oportunidades",
                    value: crmIndicators[0]?.new
                  },
                  {
                    label: "Agendadas",
                    value: crmIndicators[0]?.scheduled,
                    conversionPercentage: `${(
                      (crmIndicators[0]?.scheduled / crmIndicators[0]?.new) *
                        100 || 0
                    )?.toFixed(2)}%`
                  },
                  {
                    label: "Comparecidas",
                    value: crmIndicators[0]?.attended,
                    conversionPercentage: `${(
                      (crmIndicators[0]?.attended /
                        crmIndicators[0]?.scheduled) *
                        100 || 0
                    )?.toFixed(2)}%`
                  },
                  {
                    label: "Ganho",
                    value: crmIndicators[0]?.gained,
                    conversionPercentage: `${(
                      (crmIndicators[0]?.gained / crmIndicators[0]?.attended) *
                        100 || 0
                    )?.toFixed(2)}%`
                  }
                ]}
              />
            </div>
          </div>
          {sales?.length > 0 && (
            <div className="custom-bordered uk-margin-small-top">
              <div className="uk-width-1-1 uk-margin-small-right">
                <h4 className="uk-margin-remove">Vendas por período</h4>
                <div className="table-container uk-width-1-1">
                  <Table
                    pagination={false}
                    dataSource={valuesControl.map((item) => ({
                      ...sales[0][item],
                      description: item
                    }))}
                    columns={[
                      {
                        title: "Período",
                        key: "description",
                        dataIndex: "description",
                        render: (record) => labelControl[record]
                      },
                      {
                        title: "Total",
                        key: "total",
                        dataIndex: "total",
                        render: (record) => currencyFormatter(record)
                      },
                      {
                        title: "Novos",
                        key: "new",
                        dataIndex: "new",
                        render: (record) => currencyFormatter(record)
                      },
                      {
                        title: "Recorrentes",
                        key: "recurrent",
                        dataIndex: "recurrent",
                        render: (record) => currencyFormatter(record)
                      },
                      {
                        title: "Partic. %",
                        key: "part",
                        dataIndex: "total",
                        render: (record) =>
                          `${(
                            (record /
                              valuesControl
                                .map((item) => ({
                                  ...sales[0][item],
                                  description: item
                                }))
                                .reduce(
                                  (acc, current) => acc + current.total,
                                  0
                                )) *
                            100
                          ).toFixed(2)}%`
                      }
                    ]}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="uk-width-1-5">
          <div>
            <div className="general-box" style={{ fontSize: "0.7em" }}>
              Faturamento realizado:
              <h4 className="uk-margin-remove uk-flex uk-flex-right">
                {currencyFormatter(medianTicket?.salesTotal || 0)}
              </h4>
            </div>
            <div className="uk-margin-small-top general-box">
              <div style={{ fontSize: "0.7em" }}>
                Meta Faturamento
                <h4 className="uk-margin-remove uk-flex uk-flex-right">
                  {billing?.length > 0 &&
                  billing[0]?.meta?.description !== "SemMetaDefinida"
                    ? currencyFormatter(billing[0]?.meta?.value)
                    : "-"}
                </h4>
              </div>
            </div>
            <div className="uk-margin-small-top general-box">
              <div style={{ fontSize: "0.7em" }}>Atingimento</div>
              <h4 className="uk-margin-remove uk-flex uk-flex-right">
                {billing?.length > 0 &&
                billing[0]?.meta?.description !== "SemMetaDefinida"
                  ? `${
                      billing[0]?.percentage > 0
                        ? billing[0]?.percentage?.toFixed(2)?.replace(".", ",")
                        : "0"
                    }%`
                  : "-"}
              </h4>
            </div>
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
                    }% / ${
                      billing?.length > 0
                        ? currencyFormatter(billing[0]?.projection)
                        : 0
                    }`
                  : currencyFormatter(billing[0]?.projection)}
              </h4>
            </div>
            {systemName === "Sanclá" && (
              <div className="uk-margin-small-top general-box">
                <div style={{ fontSize: "0.7em" }}>Ticket Médio pacientes</div>
                <h4 className="uk-margin-remove uk-flex uk-flex-right">
                  {currencyFormatter(
                    medianTicket?.salesTotal / medianTicket?.qtyPatients || 0
                  )}
                </h4>
              </div>
            )}
            {systemName === "LiftOne" && (
              <>
                {" "}
                <div className="uk-margin-small-top general-box">
                  <div style={{ fontSize: "0.7em" }}>Ticket médio vendas</div>
                  <h4 className="uk-margin-remove uk-flex uk-flex-right">
                    {currencyFormatter(
                      medianTicket?.salesTotal / medianTicket?.qtySales || 0
                    )}
                    &nbsp;(
                    {medianTicket?.qtySales})
                  </h4>
                </div>
                <div className="uk-margin-small-top general-box">
                  <div style={{ fontSize: "0.7em" }}>Ticket médio clientes</div>
                  <h4 className="uk-margin-remove uk-flex uk-flex-right">
                    {currencyFormatter(
                      medianTicket?.salesTotal / medianTicket?.qtyClients || 0
                    )}
                    &nbsp;(
                    {medianTicket?.qtyClients})
                  </h4>
                </div>
              </>
            )}

            <div
              className="general-box uk-margin-small-top"
              style={{ fontSize: "0.7em" }}
            >
              Orçamentos em Aberto:
              <div className="uk-flex uk-flex-right">
                <h4 className="uk-margin-remove uk-flex uk-flex-right">
                  {currencyFormatter(openBudgets[0]?.total || 0)}
                </h4>
              </div>
            </div>

            <div
              className="general-box uk-margin-small-top"
              style={{ fontSize: "0.7em" }}
            >
              Orçamentos cancelados:
              <div className="uk-flex uk-flex-right">
                <h4 className="uk-margin-remove uk-flex uk-flex-right">
                  {currencyFormatter(canceledBudgets[0]?.total || 0)}
                </h4>
              </div>
            </div>

            <div
              className="general-box uk-margin-small-top"
              style={{ fontSize: "0.7em" }}
            >
              Retorno Investimento Mkt (ROI)
              <h4 className="uk-margin-remove uk-flex uk-flex-right">
                {invData?.length > 0 ? invData[0]?.roi?.toFixed(2) : "-"}
              </h4>
            </div>
            <div
              className="general-box uk-margin-small-top"
              style={{ fontSize: "0.7em" }}
            >
              Custo aquisição cliente (CAC)
              <h4 className="uk-margin-remove uk-flex uk-flex-right">
                {cost?.length > 0
                  ? currencyFormatter(
                      (
                        cost[0]?.totalFinances /
                        (cost[0]?.uniqueClients !== 0
                          ? cost[0]?.uniqueClients
                          : 1)
                      )?.toFixed(2)
                    )
                  : "-"}
              </h4>
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
                  dataSource={subgroupDetails}
                />
              </Modal>
            )}
            {/*installment && installment?.length > 0 && (
              <div
                className="general-box uk-margin-small-top"
                style={{ fontSize: "0.7em" }}
              >
                Prazo médio parcelamento
                <h4 className="uk-margin-remove uk-flex uk-flex-right">
                  {installment[0]?.avgInstallment?.toFixed(2)} Parcelas
                </h4>
              </div>
            )*/}
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
      </Container>
    </section>
  );
};

export default Indicators;
