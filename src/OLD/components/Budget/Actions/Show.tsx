import {
  Tabs,
  Button,
  Checkbox,
  Modal,
  Table,
  Tooltip,
  AutoComplete,
  Collapse,
} from "antd";
const { TabPane } = Tabs;
import * as React from "react";
import { budgetStatusFormatter, currencyFormatter, dateFormatter } from "..";
import {
  useCompleteBudget,
  useUpdateBudgetItem,
  useUpdateSellerAndReviewer,
  useBudgetPayments,
} from "@/OLD/hooks/useBudgets";
import { useColaborators } from "@/OLD/hooks/useColaborators";

import { budgetService } from "@/OLD/services/budgets.service";

import PrintScreen from "../PrintScreen";

import ReactToPrint from "react-to-print";

import { CgDetailsMore } from "react-icons/cg";

import { normalizeStr } from "@/OLD/utils/normalizeString";
import { useAuthAdmin } from "infinity-forge";
import { SystemUser } from "@/domain";

import moment from "moment";

const columns = [
  {
    title: "Qtd",
    dataIndex: "quantity",
    key: "quantity",
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
  },
  {
    title: "Valor Total",
    dataIndex: "total_value",
    key: "total_value",
    render: (value) => currencyFormatter(value),
  },
];

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
  const { GetUser } = useAuthAdmin();
  const user = GetUser<SystemUser>();

  const { colaborators } = useColaborators(visible);

  const componentRef = React.useRef();

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

  return (
    <>
      <Tooltip title="Detalhes orçamento">
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
        title={`Mostrar orçamento - ${budget?.tag}`}
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
                  <Button
                    disabled
                    onClick={() => {
                      setVisible((prevState) => !prevState);
                    }}
                  >
                    Cancelar
                  </Button>

                  <Button
                    disabled
                    onClick={() => {
                      setVisible((prevState) => !prevState);
                    }}
                  >
                    Confirmar
                  </Button>
                  <div style={{ display: "none" }}>
                    <div ref={componentRef as any}>
                      <PrintScreen budget={data as any} />
                    </div>
                  </div>

                  <ReactToPrint
                    content={() => componentRef.current as any}
                    trigger={() => <Button>Imprimir</Button>}
                  />

                  <Button
                    onClick={() => {
                      setVisible((prevState) => !prevState);
                    }}
                  >
                    Fechar
                  </Button>
                </div>
              </footer>
            </div>
          </TabPane>
          {/*
          <TabPane tab="Negociação" key="1">
            <div>
              {budgetPayments?.length > 0 &&
                budgetPayments?.map((item) => (
                  <Collapse className="uk-margin-small-top uk-width-1-1">
                    <Panel
                      header={`${item?.descricao_forma_pagamento} - ${
                        item?.descricao_adquirente_tef
                      } - ${item?.descricao_bandeira_tef} - ${currencyFormatter(
                        item?.valor_total
                      )}`}
                    >
                      <div className="uk-flex uk-flex-right">
                        <Popconfirm
                          title="Deseja remover este pagamento ?"
                          onConfirm={() =>
                            removeBudgetPayment(item?.id_orcamento_pgto)
                          }
                        >
                          <CustomButton>Remover bloco</CustomButton>
                        </Popconfirm>
                      </div>
                    </Panel>
                  </Collapse>
                ))}{" "}
            </div>
          </TabPane>
        */}
        </Tabs>
      </Modal>
    </>
  );
}
