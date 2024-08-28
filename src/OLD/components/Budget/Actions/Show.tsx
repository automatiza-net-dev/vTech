// @ts-nocheck
import {
  Tabs,
  Checkbox,
  Modal,
  Table,
  Tooltip,
  AutoComplete,
  Collapse,
  Popconfirm,
} from "antd";
const { TabPane } = Tabs;
import * as React from "react";
import { budgetStatusFormatter, currencyFormatter, dateFormatter } from "..";
import {
  useCompleteBudget,
  useUpdateBudgetItem,
  useUpdateSellerAndReviewer,
} from "@/OLD/hooks/useBudgets";
import { useQueryClient } from "react-query";
import { useLoadPaymentsPreview } from "@/presentation";
import { useColaborators } from "@/OLD/hooks/useColaborators";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
const { Panel } = Collapse;

import PrintScreen from "../PrintScreen";

import ReactToPrint from "react-to-print";

import { CgDetailsMore } from "react-icons/cg";

import { normalizeStr } from "@/OLD/utils/normalizeString";
import { useAuthAdmin, Button, Icon } from "infinity-forge";
import { SystemUser } from "@/domain";

import moment from "moment";
import { useDictionary } from "@/presentation";

import * as S from "./styles";
import { CheckIcon, CloseIcon } from "../../Bill/Actions/Details/icons";

const columns = [
  {
    title: "Qtd",
    dataIndex: "quantity",
    key: "quantity",
    width: 60,
  },
  {
    title: "Descrição",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Confirmado",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Valor Unitário",
    dataIndex: "unitary_value",
    key: "unitary_value",
    render: (value) => (value !== "-" ? currencyFormatter(value) : "-"),
  },
  {
    title: "Desconto",
    dataIndex: "discount_value",
    key: "discount_value",
    render: (value) => (value !== "-" ? currencyFormatter(value) : "-"),
    width: 100,
  },
  {
    title: "Valor Total",
    dataIndex: "total_value",
    key: "total_value",
    render: (value) => currencyFormatter(value),
    width: 120,
  },
  {
    title: "Cortesia",
    key: "courtesy",
    dataIndex: "courtesy",
    width: 100,
  },
  {
    title: "Desc. Max",
    key: "max_discount",
    dataIndex: "max_discount",
    width: 110,
  },
  {
    title: "Dados Autorização",
    key: "auth_data",
    dataIndex: "auth_data",
  },
];

const getAuthData = (item) => {
  if (!item) return;

  const {
    courtesyApprovedUser,
    approved,
    courtesy_approved_at,
    courtesyIssuedUser,
    courtesy,
    max_discount,
    created_at,
  } = item;
  if (!courtesyApprovedUser) return;

  const approvalDate = moment(courtesy_approved_at).format("DD/MM/YYYY");

  if (approved) {
    return (
      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <CheckIcon />
        Aprovado por {courtesyApprovedUser.name} em {approvalDate}
      </span>
    );
  }

  if ((courtesy || max_discount) && courtesy_approved_at) {
    return (
      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <CloseIcon />
        Não Aprovado por {courtesyApprovedUser.name} em {approvalDate}
      </span>
    );
  }

  if ((courtesy || max_discount) && courtesy_approved_at === null) {
    return (
      <>
        {" "}
        <svg
          version="1.1"
          id="Layer_1"
          width={20}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="red"
        >
          <g>
            <g>
              <path
                d="M493.297,159.693c-12.477-30.878-31.231-59.828-56.199-84.792c-24.965-24.969-53.917-43.723-84.795-56.2
C321.421,6.22,288.611,0,255.816,0c-32.747,0-65.495,6.249-96.311,18.744c-30.813,12.491-59.693,31.244-84.603,56.158
c-24.915,24.911-43.668,53.792-56.158,84.607C6.249,190.324,0,223.072,0,255.822c0,32.794,6.222,65.602,18.701,96.485
c12.477,30.877,31.231,59.828,56.2,84.792c24.964,24.967,53.914,43.722,84.792,56.199c30.882,12.48,63.69,18.701,96.484,18.703
c32.748,0,65.497-6.249,96.315-18.743c30.814-12.49,59.695-31.242,84.607-56.158c24.915-24.912,43.668-53.793,56.158-84.608
c12.494-30.817,18.743-63.565,18.744-96.315C512,223.383,505.778,190.575,493.297,159.693z M461.611,339.66
c-10.821,26.683-27.018,51.648-48.659,73.292c-21.643,21.64-46.608,37.837-73.291,48.659
c-26.679,10.818-55.078,16.241-83.484,16.241c-28.477,0-56.947-5.406-83.688-16.214c-26.744-10.813-51.76-27.008-73.441-48.685
C77.37,391.27,61.174,366.255,50.363,339.51c-10.808-26.741-16.214-55.212-16.213-83.689c-0.001-28.405,5.423-56.802,16.24-83.482
c10.821-26.683,27.018-51.648,48.659-73.291c21.643-21.64,46.607-37.837,73.289-48.659c26.678-10.818,55.075-16.242,83.48-16.242
c28.478,0,56.95,5.405,83.691,16.213c26.745,10.811,51.762,27.007,73.445,48.686c21.678,21.682,37.873,46.697,48.685,73.441
c10.808,26.741,16.214,55.211,16.214,83.688C477.852,284.582,472.429,312.98,461.611,339.66z"
              />
            </g>
          </g>
          <g>
            <g>
              <path
                d="M279.627,256.001l82.693-82.693c6.525-6.525,6.525-17.102,0-23.627c-6.524-6.524-17.102-6.524-23.627,0L256,232.375
l-82.693-82.693c-6.525-6.524-17.102-6.524-23.627,0c-6.524,6.524-6.524,17.102,0,23.627l82.693,82.693l-82.693,82.693
c-6.524,6.523-6.524,17.102,0,23.627c6.525,6.524,17.102,6.524,23.627,0L256,279.628l82.693,82.693
c6.525,6.524,17.102,6.524,23.627,0c6.525-6.524,6.525-17.102,0-23.627L279.627,256.001z"
              />
            </g>
          </g>
        </svg>
        Pendente de liberação;
      </>
    );
  }
};

const mapper = (data = [], total = 0, handleFn: any) => {
  return data.map((item: any) => ({
    quantity: item.quantity,
    description: item?.productVariation?.product?.description,
    status: (
      <Checkbox
        checked={item.status !== "NAO_CONFIRMADO__CANCELADO"}
        onChange={() => handleFn(item)}
      >
        {budgetStatusFormatter(item.status)}{" "}
      </Checkbox>
    ),
    unitary_value: item.unitary_value,
    discount_value: item.discount_value,
    total_value: item.total_value,
    courtesy: item?.courtesy ? "Sim" : "Não",
    max_discount: item?.max_discount ? "Sim" : "Não",
    auth_data: getAuthData(item),
  }));
};

export default function ShowBudget({ budget, setReload }: any) {
  const [visible, setVisible] = React.useState(false);
  const [payload, setPayload] = React.useState<any>({});
  const [activeTab, setActiveTab] = React.useState("0");
  const [editFields, setEditFields] = React.useState({
    seller: false,
    reviewer: false,
  });

  const { data, refetch } = useCompleteBudget(budget.id, visible);
  const { mutate } = useUpdateBudgetItem();
  const { mutate: mutateSellerAndReviewer } = useUpdateSellerAndReviewer(
    budget?.id
  );
  const { user } = useAuthAdmin();
  const { data: budgetPayments } = useLoadPaymentsPreview({
    budgetId: budget.id,
    fetch: visible,
  });

  const { colaborators } = useColaborators(visible);

  const componentRef = React.useRef();
  const queryClient = useQueryClient();
  const removeBudgetPaymentPermission = useUserHasPermission("ORC10");

  const handleFn = (item: any) => {
    mutate(
      {
        id: item.id,
        quantity: item.quantity,
        unitaryValue: item.unitary_value,
        discountValue: item.discount_value,
        status:
          item.status === "ABERTO" ? "NAO_CONFIRMADO__CANCELADO" : "ABERTO",
      } as any,
      {
        onSuccess: () => {
          refetch();
          setReload && setReload((prv) => !prv);
        },
      }
    );
  };

  const submitReviewerAndSeller = () => {
    let newObj = { ...payload } as any;

    if (!payload?.sellerId) {
      newObj.sellerId = user?.id;
    }
    mutateSellerAndReviewer(
      { ...newObj },
      {
        onSuccess: () => {
          refetch();
          setReload && setReload((prv) => !prv);
          setEditFields({} as any);
        },
      }
    );
  };

  React.useEffect(() => {
    setPayload({
      sellerId: budget?.seller?.id,
      sellerName: budget?.seller?.name,
      reviewerName: budget?.reviewer?.name,
      reviewerId: budget?.reviewer?.id,
      clientId: budget?.client?.id,
      patientId: budget?.patient?.id,
    });
  }, [budget]);

  const { getWord } = useDictionary();

  const removeBudgetPayment = (id) => {
    budgetService
      .removeBudgetPayment({ budgetPaymentId: id, origin: "Orçamento" })
      .then((_res) => {
        setPaymentsReload((prv) => !prv);
        queryClient.invalidateQueries({ queryKey: ["paymentsPreview"] });
        notification.success({ message: "Pagamento removido com sucesso!" });
      })
      .catch((err) => {
        return notification.error({
          message: err?.response?.data?.message?.split(":")[1],
        });
      });
  };

  return (
    <>
      <Tooltip title={`Detalhes ${getWord("Orçamento")}`}>
        <CgDetailsMore
          className="icon"
          size={30}
          onClick={() => {
            setVisible((prevState) => !prevState);
          }}
        />
      </Tooltip>

      <Modal
        visible={visible}
        footer={null}
        title={`Mostrar ${getWord("Orçamento")} - ${budget?.tag}`}
        width={1200}
        onCancel={() => setVisible((prevState) => !prevState)}
      >
        <Tabs
          defaultActiveKey="1"
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
        >
          <TabPane tab={"Detalhes"} key={0}>
            <div>
              <div
                className="uk-flex uk-flex-between"
                style={{ paddingBottom: "1rem" }}
              >
                <div className="uk-flex uk-flex-column uk-width-1-1">
                  <span className="uk-text-small">Data de Criação</span>
                  <span className="uk-text-default">
                    {dateFormatter(data?.budget_date)}
                  </span>
                </div>

                <div className="uk-flex uk-flex-column uk-width-1-1">
                  <span className="uk-text-small">Data Validade</span>
                  <span className="uk-text-default">
                    {moment(data?.expiration_date).format("DD/MM/YYYY")}
                  </span>
                </div>

                <div className="uk-flex uk-flex-column uk-width-1-1">
                  <span className="uk-text-small">Finalizado em</span>
                  <span className="uk-text-default">
                    {data?.finished_at ? dateFormatter(data?.finished_at) : "-"}
                  </span>
                </div>

                <div className="uk-flex uk-flex-column uk-width-1-1">
                  <span className="uk-text-small">Status</span>
                  <span className="uk-text-default">
                    {budgetStatusFormatter(data?.status)}
                  </span>
                </div>
              </div>
              <hr className="uk-margin-remove" />
              <div
                className="uk-flex uk-flex-between uk-margin-small-top"
                style={{ paddingBottom: "1rem" }}
              >
                <div className="uk-flex uk-flex-column uk-width-1-1">
                  <span className="uk-text-small">Cliente</span>
                  <span className="uk-text-default">{data?.client?.name}</span>
                </div>

                <div className="uk-flex uk-flex-column uk-width-1-1">
                  <span className="uk-text-small">CPF/CNPJ</span>
                  <span className="uk-text-default">
                    {data?.client?.tutor?.document}
                  </span>
                </div>
                {process.env.client !== "liftone" && (
                  <div className="uk-flex uk-flex-column uk-width-1-1">
                    <span className="uk-text-small">Paciente</span>
                    <span className="uk-text-default">
                      {data?.patient?.name ?? ""}
                    </span>
                  </div>
                )}

                {process.env.client !== "liftone" && (
                  <>
                    <div className="uk-flex uk-flex-column uk-width-1-1">
                      <div className="uk-flex">
                        <span className="uk-text-small uk-margin-right">
                          Vendedor
                        </span>
                        {!editFields?.seller ? (
                          <span
                            className="uk-link"
                            onClick={() =>
                              setEditFields((prv) => ({ ...prv, seller: true }))
                            }
                          >
                            Alterar
                          </span>
                        ) : (
                          <div>
                            <span
                              className="uk-link uk-margin-right"
                              onClick={() => submitReviewerAndSeller()}
                            >
                              Salvar
                            </span>
                            <span
                              className="uk-link"
                              onClick={() => {
                                setEditFields((prv) => ({
                                  ...prv,
                                  seller: false,
                                }));
                                setPayload((prv) => ({
                                  ...prv,
                                  sellerId: budget?.seller?.id,
                                  sellerName: budget?.seller?.name,
                                }));
                              }}
                            >
                              Cancelar
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="uk-width-1-2">
                        <AutoComplete
                          disabled={!editFields?.seller}
                          className="uk-width-1-1"
                          value={payload?.sellerName}
                          options={colaborators?.map((collab: any) => ({
                            ...collab,
                            value: collab?.name,
                          }))}
                          onChange={(val) =>
                            setPayload((prv) => ({ ...prv, sellerName: val }))
                          }
                          onSelect={(_, opt) =>
                            setPayload((prv) => ({
                              ...prv,
                              sellerId: opt?.id,
                              sellerName: opt?.value,
                            }))
                          }
                          filterOption={(val, opt) =>
                            normalizeStr(opt?.value.toUpperCase()).includes(
                              normalizeStr(val?.toUpperCase())
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="uk-flex uk-flex-column uk-width-1-1">
                      {process.env.clientName === "LiftOne" && (
                        <>
                          <div className="uk-flex">
                            <span className="uk-text-small uk-margin-right">
                              Avaliador
                            </span>
                            {!editFields?.reviewer ? (
                              <span
                                className="uk-link"
                                onClick={() =>
                                  setEditFields((prv) => ({
                                    ...prv,
                                    reviewer: true,
                                  }))
                                }
                              >
                                Alterar
                              </span>
                            ) : (
                              <div>
                                <span
                                  className="uk-link uk-margin-right"
                                  onClick={() => submitReviewerAndSeller()}
                                >
                                  Salvar
                                </span>
                                <span
                                  className="uk-link"
                                  onClick={() => {
                                    setEditFields((prv) => ({
                                      ...prv,
                                      reviewer: false,
                                    }));
                                    setPayload((prv) => ({
                                      ...prv,
                                      reviewerName: budget?.reviewer?.name,
                                      reviewerId: budget?.reviewer?.id,
                                    }));
                                  }}
                                >
                                  Cancelar
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="uk-width-1-2">
                            <AutoComplete
                              disabled={!editFields?.reviewer}
                              className="uk-width-1-1"
                              value={payload?.reviewerName}
                              options={colaborators?.map((collab: any) => ({
                                ...collab,
                                value: collab?.name,
                              }))}
                              onChange={(val) =>
                                setPayload((prv) => ({
                                  ...prv,
                                  reviewerName: val,
                                }))
                              }
                              onSelect={(_, opt) =>
                                setPayload((prv) => ({
                                  ...prv,
                                  reviewerId: opt?.id,
                                  reviewerName: opt?.value,
                                }))
                              }
                              filterOption={(val, opt) =>
                                normalizeStr(opt?.value.toUpperCase()).includes(
                                  normalizeStr(val?.toUpperCase())
                                )
                              }
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
              <hr className="uk-margin-remove" />
              <div
                className="uk-flex uk-flex-between uk-margin-small-top"
                style={{ paddingBottom: "1rem" }}
              >
                <div className="uk-flex uk-flex-column uk-width-1-1">
                  <span className="uk-text-small">Observação</span>
                  <span className="uk-text-default">
                    {data?.observation ?? "-"}
                  </span>
                </div>
                <div className="uk-flex uk-flex-column uk-width-1-1">
                  <span className="uk-text-small">Observação Interna</span>
                  <span className="uk-text-default">
                    {data?.internal_observation ?? "-"}
                  </span>
                </div>
              </div>
              {Boolean(data?.cancelationReason) && (
                <>
                  <hr />

                  <div
                    className="uk-flex uk-flex-between"
                    style={{ paddingBottom: "1rem" }}
                  >
                    <div className="uk-flex uk-flex-column uk-width-1-1">
                      <span className="uk-text-small">Motivo</span>
                      <span className="uk-text-default">
                        {data?.cancelationReason.reason}
                      </span>
                    </div>
                  </div>
                </>
              )}
              <hr className="uk-margin-remove" />
              <div className="uk-flex uk-flex-column uk-width-1-1">
                <span className="uk-text-small">Produtos</span>
                <Table
                  columns={columns}
                  dataSource={mapper(data?.items, data?.total_value, handleFn)}
                  pagination={false}
                  scroll={{ y: 1000 }}
                />
                <div
                  className="uk-margin-top uk-flex uk-margin-small-left uk-padding-small uk-flex-around"
                  style={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
                >
                  <div className="uk-width-1-6">
                    <strong>Totais:</strong>
                  </div>
                  <div className="uk-width-1-6">
                    {data?.items.reduce(
                      (acc, current) =>
                        current?.status !== "NAO_CONFIRMADO__CANCELADO"
                          ? acc + current.quantity
                          : acc,
                      0
                    )}
                  </div>
                  <div className="uk-width-1-6">
                    {currencyFormatter(
                      data?.items.reduce(
                        (acc, current) =>
                          current?.status !== "NAO_CONFIRMADO__CANCELADO"
                            ? acc +
                              current.total_value +
                              current?.discount_value
                            : acc,
                        0
                      )
                    )}
                  </div>
                  <div className="uk-width-1-6">
                    {currencyFormatter(
                      data?.items.reduce(
                        (acc, current) =>
                          current?.status !== "NAO_CONFIRMADO__CANCELADO"
                            ? acc + current.discount_value
                            : acc,
                        0
                      )
                    )}
                  </div>
                  <div className="uk-width-1-6">
                    {currencyFormatter(
                      data?.items.reduce(
                        (acc, current) =>
                          current?.status !== "NAO_CONFIRMADO__CANCELADO"
                            ? acc + current.total_value
                            : acc,
                        0
                      )
                    )}
                  </div>
                </div>
              </div>
              <hr />
              <footer className="uk-flex uk-flex-right uk-margin-top">
                <div
                  className="uk-width-1-1 uk-flex uk-flex-right"
                  style={{ gap: "1rem" }}
                >
                  <div style={{ display: "none" }}>
                    <div ref={componentRef as any}>
                      <PrintScreen budget={data as any} />
                    </div>
                  </div>

                  <ReactToPrint
                    content={() => componentRef.current as any}
                    trigger={() => <Button text="Imprimir" />}
                  />

                  <Button
                    text="Voltar"
                    onClick={() => {
                      setVisible((prevState) => !prevState);
                    }}
                  />
                </div>
              </footer>
            </div>
          </TabPane>
          <TabPane tab="Negociação" key="1">
            <div>
              {budgetPayments?.length > 0 &&
                budgetPayments?.map((item) => (
                  <Collapse className="uk-margin-small-top uk-width-1-1">
                    <Panel
                      header={`${item?.descricao_forma_pagamento} - ${
                        item?.descricao_adquirente_tef
                          ? item?.descricao_adquirente_tef + " - "
                          : ""
                      }  ${
                        item?.descricao_bandeira_tef
                          ? item?.descricao_bandeira_tef + " - "
                          : ""
                      } ${currencyFormatter(item?.valor_total)} (${
                        item?.qtd_parcelas_bloco_pgto
                      }x)`}
                    >
                      <S.Status>
                        {item?.status === "Excluido" && (
                          <>
                            <div
                              className="ball"
                              style={{ background: "red" }}
                            />

                            <span>{`Excluido por ${
                              item?.nome_usuario_exclusao
                            } em ${moment(item?.data_exclusao).format(
                              "DD/MM/YYYY"
                            )} (Origem: ${item?.origem_exclusao})`}</span>
                          </>
                        )}

                        {item?.status === "Confirmado" && (
                          <>
                            <div
                              className="ball"
                              style={{ background: "green" }}
                            />

                            <span>{`Confirmado por ${
                              item?.nome_usuario_confirmacao
                            } em ${moment(item?.data_confirmacaoo).format(
                              "DD/MM/YYYY"
                            )}`}</span>
                          </>
                        )}
                      </S.Status>
                      {/* {removeBudgetPaymentPermission && (
                        <div className="uk-flex uk-flex-right">
                          <Popconfirm
                            title="Deseja remover este pagamento ?"
                            onConfirm={() =>
                              removeBudgetPayment(item?.id_orcamento_pgto)
                            }
                          >
                            <Button text="Remover bloco" />
                          </Popconfirm>
                        </div>
                      )} */}
                    </Panel>
                  </Collapse>
                ))}{" "}
            </div>
          </TabPane>
        </Tabs>
      </Modal>
    </>
  );
}
