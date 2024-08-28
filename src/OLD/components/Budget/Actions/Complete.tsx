// @ts-nocheck
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  Modal,
  Select,
  Table,
  Tooltip,
  Tabs,
} from "antd";
import moment from "moment";
import * as React from "react";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { currencyFormatter } from "..";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import { useCompleteBudget, useConfirmBudget } from "@/OLD/hooks/useBudgets";
import { useGetAllReasons } from "@/OLD/hooks/useReasons";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { BsCheckCircle } from "react-icons/bs";
import { budgetService } from "@/OLD/services/budgets.service";
import Negotiation from "@/OLD/components/Budget/Negotiation";

import { useDictionary, useLoadAllPatientTutor } from "@/presentation";
import {
  FormHandler,
  Select as InfinityForgeSelect,
  useToast,
} from "infinity-forge";
import {
  financialServicesContainer,
  financialServicesTypes,
} from "@/container";
import { RemoteBudget } from "@/data";

const { TextArea } = Input;
const { TabPane } = Tabs;

const columns = [
  {
    title: "Produto",
    dataIndex: "product",
    key: "product",
  },
  {
    title: "Quantidade",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Valor",
    dataIndex: "value",
    key: "value",
  },
  {
    title: "Desconto",
    dataIndex: "discount",
    key: "discount",
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
  },
  {
    title: "Cortesia",
    dataIndex: "courtesy",
    key: "courtesy",
  },
  {
    title: "Desc. Max.",
    dataIndex: "maxDiscount",
    key: "maxDiscount",
  },
  {
    title: "Dados Aprovação",
    dataIndex: "approved",
    key: "approved",
  },
  {
    title: "",
    dataIndex: "confirm",
    key: "confirm",
  },
];

export default function CompleteBudget({ budget, setReload = false }) {
  const queryClient = useQueryClient();
  const [visible, setVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [observation, setObservation] = React.useState("Sem observações");
  const [client, setClient] = React.useState({});
  const [activeTab, setActiveTab] = React.useState("0");
  const [internalObservation, setInternalObservation] =
    React.useState("Sem observações");
  const [formData, setFormData] = React.useState({
    id: budget?.id,
    notConfirmedItems: [],
    type: "TOTAL",
    finishedAt: moment(),
    observation,
    internalObservation,
  });

  const res = useLoadAllPatientTutor({ needFilterToCallApi: false });
  const tutors = res.data;

  const { createToast } = useToast();
  const { data } = useCompleteBudget(budget.id, visible);
  const { data: reasons } = useGetAllReasons({
    enabled: visible,
    params: { type: "OR" },
  });
  // const { mutate, isLoading, data } = useConfirmBudget(budget.id);

  const { getWord } = useDictionary();

  const confirmBudgetPermission = useUserHasPermission("ORC03");
  const router = useRouter();
  const validBudget =
    budget.status === "ABERTO" || budget.status === `Orçamento em aberto`;

  const notificationStructure = (bill) => (
    <section>
      <p className="uk-margin remove">
        Para acessar os detalhes da venda, clique{" "}
        <span
          className="uk-link"
          onClick={() => {
            router.push(`/dashboard/vendas/detalhes/${bill?.id}`);
          }}
        >
          Aqui
        </span>
      </p>
    </section>
  );

  const updateObservation = React.useCallback(() => {
    budgetService.updateObservation(data?.id, {
      observation,
      internalObservation,
    });
  }, [data, observation, internalObservation]);

  const updateClient = React.useCallback(
    (clientId) => {
      budgetService.updateBudgetSellerAndReviewer(data?.id, {
        clientId,
      });
    },
    [data]
  );

  const submit = React.useCallback(async () => {
    if (!validBudget) {
      return;
    }
    try {
      setIsLoading(true);

      updateObservation();

      const result = await financialServicesContainer
        .get<RemoteBudget>(financialServicesTypes.RemoteBudget)
        .confirm(formData);

      await queryClient.invalidateQueries(["budgets"]);
      setReload && setReload((prv) => !prv);
      setVisible(false);
      setIsLoading(false);

      return createToast({
        message: (
          <>
            {getWord("Orçamento")} confirmado com sucesso, para acessar os
            detalhes da venda, clique{" "}
            <a
              onClick={() => {
                router.push(`/dashboard/vendas?id=${res?.id}`);
              }}
            >
              aqui
            </a>
          </>
        ),
        status: "success",
      });
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error?.error?.message;

      if (errorMessage) {
        createToast({
          message: errorMessage,
          status: "error",
        });
        return;
      }

      const errors = Object.entries(error.errors || {}).flatMap(
        ([_, value]) => value?.errors || []
      );

      errors.forEach((e) =>
        createToast({
          message: e,
          status: "error",
        })
      );
    }
  }, [validBudget, formData, updateObservation]);

  React.useEffect(() => {
    if (!visible || !data) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      notConfirmedItems: data?.items
        ?.filter((f) => {
          if (data?.approved && courtesy_approved_at) {
            return false;
          }
          return f.status === "NAO_CONFIRMADO__CANCELADO";
        })
        .map((m) => m.id),
    }));
  }, [visible, JSON.stringify(data)]);

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

  React.useEffect(() => {
    if (formData?.notConfirmedItems?.length > 0) {
      setFormData({ ...formData, type: "PARCIAL" });
    } else {
      setFormData({ ...formData, type: "TOTAL" });
    }
  }, [formData?.notConfirmedItems]);

  React.useEffect(() => {
    data?.observation && setObservation(data?.observation);
    data?.internal_observation &&
      setInternalObservation(data?.internal_observation);
    !data?.client && setClient({ name: data?.client_name });
  }, [data]);

  const productsData = React.useMemo(() => {
    if (data?.items) {
      return data.items.map((item) => ({
        key: item.id,
        product: item?.productVariation?.product?.description,
        quantity: item.quantity,
        value: currencyFormatter(item.unitary_value.toString()),
        total: currencyFormatter(item.total_value.toString()),
        discount: currencyFormatter(item?.discount_value),
        courtesy: <input disabled checked={item.courtesy} type="checkbox" />,
        maxDiscount: item?.max_discount ? "sim" : "não",
        approved: getAuthData(item),
        confirm: (
          <Checkbox
            checked={!formData.notConfirmedItems.includes(item.id)}
            id={item.id}
            onChange={(e) => {
              if (!e.target.checked) {
                setFormData((prev) => ({
                  ...prev,
                  notConfirmedItems: [...prev.notConfirmedItems, item.id],
                }));
              } else {
                setFormData((prev) => ({
                  ...prev,
                  notConfirmedItems: prev.notConfirmedItems.filter(
                    (i) => i !== item.id
                  ),
                }));
              }
            }}
          >
            Confirmar
          </Checkbox>
        ),
      }));
    }

    return [];
  }, [data?.items, formData.notConfirmedItems]);

  const tutorsList =
    tutors?.map((tutor) => ({
      label: tutor?.name,
      value: tutor?.id,
    })) || [];

  return (
    <>
      {confirmBudgetPermission && (
        <Tooltip title={`Confirmar ${getWord("Orçamento")}`}>
          <BsCheckCircle
            className="icon"
            size={20}
            onClick={() =>
              validBudget ? setVisible((prevState) => !prevState) : null
            }
            style={{ opacity: validBudget ? 1 : 0.5 }}
          />
        </Tooltip>
      )}

      <Modal
        visible={visible}
        footer={null}
        title={`Confirmar ${getWord("Orçamento")} - ${budget?.tag}`}
        width={1300}
        onCancel={() => setVisible((prevState) => !prevState)}
      >
        <Tabs
          defaultActiveKey="0"
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
        >
          <TabPane tab="Confirmar" key="0">
            <div
              className="uk-flex uk-flex-between"
              style={{ paddingBottom: "1rem" }}
            >
              <div className="uk-flex uk-flex-column uk-width-1-1 uk-margin-small-right">
                <span className="uk-text-small">Cliente</span>
                {data?.client ? (
                  <span className="uk-text-default">{data?.client?.name}</span>
                ) : (
                  <FormHandler initialData={{ tutor: data?.client_name }}>
                    <InfinityForgeSelect
                      value={client?.id}
                      name="tutor"
                      onlyOneValue
                      onChangeSelect={(value: string) => {
                        updateClient(value);
                        setClient({
                          name: tutorsList.find((t) => t.value === value)
                            ?.label,
                          id: value,
                        });
                      }}
                      options={
                        tutorsList && tutorsList.length > 0
                          ? [
                              ...tutorsList,
                              {
                                label: data?.client_name,
                                value: data?.client_name,
                              },
                            ]
                          : []
                      }
                    />
                  </FormHandler>
                )}
              </div>
              {process.env.client !== "liftone" && (
                <div className="uk-flex uk-flex-column uk-width-1-1">
                  <span className="uk-text-small">Paciente</span>
                  <span className="uk-text-default">
                    {data?.patient?.name ?? ""}
                  </span>
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div className="uk-flex uk-flex-column">
                <Table
                  columns={columns}
                  dataSource={productsData}
                  pagination={false}
                  scroll={{ y: 300 }}
                />
              </div>
              <div
                style={{
                  backgroundColor: "#F5F5F5",
                  borderRadius: "5px",
                  display: "flex",
                  width: "100%",
                  padding: "20px",
                }}
              >
                <div style={{ width: "15%" }}>
                  <strong>Totais:</strong>
                </div>
                <div style={{ width: "15%" }}>
                  {productsData.reduce(
                    (acc, current) =>
                      !formData?.notConfirmedItems.includes(current?.key)
                        ? acc + current.quantity
                        : acc,
                    0
                  )}
                </div>
                <div style={{ width: "15%" }}>
                  {currencyFormatter(
                    productsData.reduce(
                      (acc, current) =>
                        !formData?.notConfirmedItems.includes(current?.key)
                          ? acc +
                            convertIntlCurrency(current.total) +
                            convertIntlCurrency(current.discount)
                          : acc,
                      0
                    )
                  )}
                </div>
                <div style={{ width: "15%" }}>
                  {currencyFormatter(
                    productsData.reduce(
                      (acc, current) =>
                        !formData?.notConfirmedItems.includes(current?.key)
                          ? acc + convertIntlCurrency(current.discount)
                          : 0,
                      0
                    )
                  )}
                </div>
                <div style={{ width: "15%" }}>
                  {currencyFormatter(
                    productsData.reduce(
                      (acc, current) =>
                        !formData?.notConfirmedItems.includes(current?.key)
                          ? acc +
                            (convertIntlCurrency(current.total) -
                              convertIntlCurrency(current?.discount))
                          : 0,
                      0
                    )
                  )}
                </div>
              </div>
              <section className="uk-flex" style={{ gap: "10px" }}>
                <div className="uk-width-1-2">
                  <label>Observação</label>
                  <TextArea
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                  />
                </div>
                <div className="uk-width-1-2">
                  <label>Observação Interna</label>
                  <TextArea
                    value={internalObservation}
                    onChange={(e) => setInternalObservation(e.target.value)}
                  />
                </div>
              </section>

              <div className="uk-flex">
                <div className="uk-width-1-2 uk-margin-small-right">
                  <label>Hora</label>
                  <DatePicker
                    showTime
                    format="HH:mm DD/MM/YYYY"
                    style={{ width: "100%" }}
                    value={
                      formData?.finishedAt ? moment(formData.finishedAt) : null
                    }
                    onChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        finishedAt: value.toISOString(),
                      }));
                    }}
                  />
                </div>
                <div className="uk-width-1-2">
                  <label>Tipo</label>
                  <Select
                    placeholder="Tipo"
                    value={formData?.type}
                    onChange={(value) =>
                      setFormData((prevState) => ({
                        ...prevState,
                        type: value,
                      }))
                    }
                    style={{ width: "100%" }}
                    options={[
                      { label: "Total", value: "TOTAL" },
                      { label: "Parcial", value: "PARCIAL" },
                    ]}
                  />
                </div>
              </div>

              {formData?.type === "PARCIAL" && (
                <>
                  <div className="uk-width-1-1">
                    <label>Motivo</label>
                    <Select
                      placeholder="Motivo"
                      value={formData?.reasonId}
                      onChange={(value) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          reasonId: value,
                        }))
                      }
                      style={{ width: "100%" }}
                      options={reasons?.map((reason) => ({
                        label: reason.reason,
                        value: reason.id,
                      }))}
                    />
                  </div>

                  <div className="uk-width-1-1">
                    <label>Observação</label>
                    <Input.TextArea
                      rows={2}
                      value={formData?.canceledObservation}
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          canceledObservation: e.target.value,
                        }))
                      }
                    />
                  </div>
                </>
              )}

              <hr />
              <footer className="uk-flex uk-flex-right">
                <div className="uk-width-1-2 uk-flex uk-flex-around">
                  <Button htmlType="submit" type="primary" disabled={isLoading}>
                    Salvar
                  </Button>

                  <Button
                    onClick={() => {
                      setFormData({
                        notConfirmedItems: [],
                        type: "TOTAL",
                        finishedAt: moment(),
                      });
                      setVisible((prevState) => !prevState);
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </footer>
            </form>
          </TabPane>

          <TabPane tab="Pagamentos" key="1">
            <Negotiation budgetId={budget?.id} />
          </TabPane>
        </Tabs>
      </Modal>
    </>
  );
}
