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
    title: "",
    dataIndex: "confirm",
    key: "confirm",
  },
];

export default function CompleteBudget({ budget, setReload = false }) {
  const queryClient = useQueryClient();
  const [visible, setVisible] = React.useState(false);
  const [observation, setObservation] = React.useState("Sem observações");
  const [client, setClient] = React.useState({});
  const [activeTab, setActiveTab] = React.useState("0");
  const [internalObservation, setInternalObservation] =
    React.useState("Sem observações");
  const [formData, setFormData] = React.useState({
    notConfirmedItems: [],
    type: "TOTAL",
    finishedAt: moment(),
  });

  const res = useLoadAllPatientTutor({ needFilterToCallApi: false });
  const tutors = res.data;

  const { createToast } = useToast();
  const { data } = useCompleteBudget(budget.id, visible);
  const { data: reasons } = useGetAllReasons({
    enabled: visible,
    params: { type: "OR" },
  });
  const { mutate, isLoading } = useConfirmBudget(budget.id);

  const { getWord } = useDictionary();

  const confirmBudgetPermission = useUserHasPermission("ORC03");
  const router = useRouter();
  const validBudget =
    budget.status === "ABERTO" ||
    budget.status === `Orçamento em aberto`;

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

  const submit = React.useCallback(() => {
    if (!validBudget) {
      return;
    }

    updateObservation();

    mutate(formData, {
      onSuccess: async (res) => {
        await queryClient.invalidateQueries(["budgets"]);
        setReload && setReload((prv) => !prv);
        setVisible(false);
        setFormData({
          notConfirmedItems: [],
          type: "TOTAL",
          finishedAt: moment(),
        });
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
      },
      onError: (err) => {
        createToast({
          message:
            err.response.data.validationErrors.canceledObservation.errors,
          status: "error",
        });

        if (
          err?.response?.data?.message.includes(
            `É necessário informar o cliente para confirmar o ${getWord(
              "Orçamento"
            )}`
          )
        ) {
          return createToast({
            message: `Cliente informado não encontrado na base de dados, cadastre um novo cliente ou selecione um cliente já cadastrado para confirmar o ${getWord(
              "Orçamento"
            )}`,
            status: "error",
          });
        }
      },
    });
  }, [validBudget, formData, updateObservation]);

  React.useEffect(() => {
    if (!visible || !data) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      notConfirmedItems: data?.items
        ?.filter((f) => f.status === "NAO_CONFIRMADO__CANCELADO")
        .map((m) => m.id),
    }));
  }, [visible, JSON.stringify(data)]);

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
                className="uk-margin-top uk-flex uk-margin-small-left uk-padding-small uk-flex-around"
                style={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
              >
                <div className="uk-width-1-6">
                  <strong>Totais:</strong>
                </div>
                <div className="uk-width-1-6">
                  {productsData.reduce(
                    (acc, current) =>
                      !formData?.notConfirmedItems.includes(current?.key)
                        ? acc + current.quantity
                        : acc,
                    0
                  )}
                </div>
                <div className="uk-width-1-6">
                  {currencyFormatter(
                    productsData.reduce(
                      (acc, current) =>
                        !formData?.notConfirmedItems.includes(current?.key)
                          ? acc + convertIntlCurrency(current.total)
                          : acc,
                      0
                    )
                  )}
                </div>
                <div className="uk-width-1-6">
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
                <div className="uk-width-1-6">
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
