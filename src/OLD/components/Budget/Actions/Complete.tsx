// @ts-nocheck
import { Button, Checkbox, DatePicker, Input, Table } from "antd";
import moment from "moment";
import * as React from "react";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { currencyFormatter } from "..";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import { useCompleteBudget, useConfirmBudget } from "@/OLD/hooks/useBudgets";
import { useGetAllReasons } from "@/OLD/hooks/useReasons";
import { useLoadAllPatientTutor, useSystem } from "@/presentation/hooks";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { BsCheckCircle } from "react-icons/bs";
import { budgetService } from "@/OLD/services/budgets.service";
import Negotiation from "@/OLD/components/Budget/Negotiation";
import { Modal, Tooltip } from "infinity-forge";

import { useDictionary } from "@/presentation";
import { useToast, LoaderCircle, Select, FormHandler } from "infinity-forge";
import {
  financialServicesContainer,
  financialServicesTypes,
} from "@/container";
import { RemoteBudget } from "@/data";
import { AuthorizationStatusProduct } from "@/presentation";

const { TextArea } = Input;

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
  const [stockProducts, setStockProducts] = React.useState<any>([]);
  const [stockProductsOpen, setStockProductsOpen] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [observation, setObservation] = React.useState("Sem observações");
  const [activeTab, setActiveTab] = React.useState("0");
  const [internalObservation, setInternalObservation] =
    React.useState("Sem observações");

  const tutors = useLoadAllPatientTutor({});
  const { createToast } = useToast();
  const { data, isLoading: loadingBudget } = useCompleteBudget(
    budget.id,
    visible
  );

  const {unit} = useSystem()

  const [formData, setFormData] = React.useState({
    id: budget?.id,
    notConfirmedItems: [],
    type: "TOTAL",
    finishedAt: moment(),
    observation,
    internalObservation,
  });

  const { data: reasons } = useGetAllReasons({
    enabled: visible,
    params: { type: "OR" },
  });

  const { getWord } = useDictionary();

  const confirmBudgetPermission = useUserHasPermission("ORC03");
  const router = useRouter();
  const validBudget =
    budget.status === "ABERTO" ||
    budget.status === `Orçamento em aberto` ||
    budget.status === "Nao Aprovada";

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
        .confirm({
          ...formData,
          name: data?.client_name || data?.client?.name,
        });

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
                router.push(`/dashboard/vendas?id=${result?.id}`);
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

      if (errorMessage?.includes("não existe no depósito")) {
        setStockProducts(errorMessage?.replaceAll("=", "|").split("|"));
        return setStockProductsOpen(true);
      }

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
        approved: <AuthorizationStatusProduct item={item} />,
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

  return (
    <>
      {confirmBudgetPermission && (
        <Tooltip
          idTooltip="add-payment-prev"
          content="Confirmar Orçamento"
          enableHover
          trigger={
            <BsCheckCircle
              className="icon"
              size={20}
              onClick={() =>
                validBudget ? setVisible((prevState) => !prevState) : null
              }
              style={{ opacity: validBudget ? 1 : 0.5 }}
            />
          }
        />
      )}

      <Modal
        open={visible}
        styles={{ maxWidth: 1300, padding: "15px 0 " }}
        onClose={() => setVisible((prevState) => !prevState)}
      >
        <h2
          style={{
            fontSize: 16,
            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
            paddingBottom: 10,
            marginBottom: 10,
          }}
          className="title"
        >{`Confirmar ${getWord("Orçamento")} - ${budget?.tag}`}</h2>

        <div
          className="uk-flex uk-flex-between"
          style={{ paddingBottom: "1rem" }}
        >
          <div className="uk-flex uk-flex-column uk-width-1-1 uk-margin-small-right">
            <span className="uk-text-small">Cliente</span>
            {data && (
              <span className="uk-text-default">
                {data?.client?.name || data?.client_name}
              </span>
            )}
          </div>
          {unit.system.type === "Vet" && (
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
              <label>Data</label>
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm"
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
            <div style={{ width: "100%" }}>
              <FormHandler
                initialData={{ type: formData?.type }}
                onChangeForm={{
                  callbackResult: (payload) => {
                    setFormData((prevState) => ({
                      ...prevState,
                      ...payload,
                    }));
                  },
                }}
              >
                <div style={{ display: "flex", width: "100%", gap: "10px" }}>
                  <div style={{ width: "100%" }}>
                    <Select
                      name="type"
                      label="tipo"
                      onlyOneValue
                      options={[
                        { label: "Total", value: "TOTAL" },
                        { label: "Parcial", value: "PARCIAL" },
                      ]}
                    />
                  </div>
                  {tutors?.data && (
                    <div style={{ width: "100%" }}>
                      <Select
                        name="financialResponsibleId"
                        label="Responsável Financeiro"
                        onlyOneValue
                        options={tutors?.data?.map((tutor) => ({
                          value: tutor?.id,
                          label: tutor?.name,
                        }))}
                      />
                    </div>
                  )}
                </div>
              </FormHandler>
            </div>
          </div>

          {formData?.type === "PARCIAL" && (
            <>
              <div>
                <FormHandler
                  initialData={{ reasonId: formData?.reasonId }}
                  onChangeForm={{
                    callbackResult: (payload) => {
                      setFormData((prevState) => ({
                        ...prevState,
                        reasonId: payload?.reasonId,
                      }));
                    },
                  }}
                >
                  <Select
                    name="reasonId"
                    onlyOneValue
                    label="Motivo"
                    options={reasons?.map((reason) => ({
                      label: reason.reason,
                      value: reason.id,
                    }))}
                  />
                </FormHandler>
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

        <Modal
          open={stockProductsOpen}
          onClose={() => setStockProductsOpen(false)}
          styles={{ width: "500px", padding: "20px" }}
          children={
            <>
              <h4>Os seguintes produtos não possuem quantidade em estoque:</h4>
              {stockProducts?.map((item, i) => {
                if (i !== 0) {
                  return <li key={i}>{item}</li>;
                }
              })}
            </>
          }
        />
      </Modal>
    </>
  );
}
