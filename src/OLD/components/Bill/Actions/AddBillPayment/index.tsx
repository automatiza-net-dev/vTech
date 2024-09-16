// @ts-nocheck
// Core
import React, { useState, memo, useEffect, useCallback } from "react";
import { useQueryClient } from "react-query";

// Services
import { RemoteBills } from "@/data";
import { container, TypesAutomatiza } from "@/container";
import { billService } from "@/OLD/services/bills.service";

// Hooks
import { useCreateBillPayment, useShowBill } from "@/OLD/hooks/useBills";
import { usePaymentMethods } from "@/OLD/hooks/usePaymentMethods";
import { useDailyCasher } from "@/OLD/hooks/useDailyCashiers";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { useLoadAllPatientTutor } from "@/presentation";

// Utils
import moment from "moment";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import { currencyFormatter } from "@/OLD/components/Budget";

// Components
import { Modal, notification } from "antd";
import CardPanel from "./CardPanel";
import { Container } from "./styles";
import NonTefPanel from "./NonTefPanel";
import ResumePanel from "./ResumePanel";
import DetailsPanel from "./DetailsPanel";
import { PaymentsPreviewComponent } from "@/presentation";
import RemoveBillPayment from "./RemoveBillPayment";
import ProductsPanel from "../Details/ProductsPanel";
import { Select, FormHandler, useToast, BadRequestError } from "infinity-forge";
import { Button } from "infinity-forge";
import { AxiosError } from "axios";

const verifyErrors = (msg) => {
  if (
    msg.includes("Não foi possível encontrar o caixa aberto para o usuário")
  ) {
    return notification.warning({
      message: "Não existe caixa diário aberto para o seu Login",
    });
  }

  if (msg?.includes("E_NOT_OPEN")) {
    return notification.warning({ message: "Não existe caixa diário aberto" });
  }
};

const AddBillPayment = memo(function AddBillPayment({ billId, setVisible }) {
  const [reload, setReload] = useState(false);
  const [filters, setFilters] = useState({ active: true });
  const [cashierFilters, setCashierFilters] = useState({
    from: moment(new Date()).startOf("day"),
    to: moment(new Date()).endOf("day"),
    status: "ABERTO",
  });

  const [debitMethods, setDebitMethods] = useState([]);
  const [creditMethods, setCreditMethods] = useState([]);
  const [nonTefMethods, setNonTefMethods] = useState([]);
  const [higherBlock, setHigherBlock] = useState(0);
  const [blockArr, setBlockArr] = useState([]);
  const [formData, setFormData] = useState({
    expirationDate: moment(),
  });
  const [allowEditFinancialRsp, setAllowEditFinancialRsp] = useState(false);
  const [financialResponsible, setFinancialResponsible] = useState({});

  const queryClient = useQueryClient();
  const endBillPermission = useUserHasPermission("VEN06");

  const { createToast } = useToast();
  const { mutate } = useCreateBillPayment();
  const { data } = useShowBill(billId, true);
  const users = useLoadAllPatientTutor(false, {});
  const { paymentMethods } = usePaymentMethods(filters);
  const { cashiers } = useDailyCasher(false, cashierFilters);

  const filterMethods = () => {
    setDebitMethods(
      paymentMethods?.filter(
        (method) => method?.tef !== "NAO" && method?.type === "DEBITO"
      )
    );

    setCreditMethods(
      paymentMethods?.filter(
        (method) => method?.tef !== "NAO" && method?.type === "CREDITO"
      )
    );

    setNonTefMethods(paymentMethods?.filter((method) => method?.tef === "NAO"));
  };

  const columns = [
    {
      title: "Forma Pgto",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (record) => record?.description,
    },
    {
      title: "Adquirente",
      dataIndex: "acquirer",
      key: "acquirer",
      render: (record) => record?.description,
    },
    {
      title: "Bandeira",
      dataIndex: "flag",
      key: "flag",
      render: (record) => record?.description,
    },
    {
      title: "Parcelas",
      dataIndex: "installments",
      key: "installments",
    },
    {
      title: "Valor",
      dataIndex: "total_value",
      key: "total_value",
      render: (record) => currencyFormatter(record),
    },
    {
      title: "Ações",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <RemoveBillPayment
          paymentId={record?.id}
          reload={reload}
          setReload={setReload}
        />
      ),
    },
  ];

  const closePayment = useCallback(() => {
    let error = false;
    billService
      .closeBillPayment(data?.id)
      .then((_res) => {
        notification.success({ message: "Venda finalizada com sucesso!" });
      })
      .catch((err) => {
        error = true;

        notification.error({
          message:
            err?.response?.data?.message ||
            "Houve um erro ao finalizar a venda, verifique se há valores pendentes",
        });
      })
      .finally(() => {
        if (!error) {
          setVisible(false);
        }
      });
  }, [data?.id]);

  const verifyPayment = () => {
    let totalPayed = 0;

    for (let i = 0; i < data?.payments?.length; i += 1) {
      totalPayed += data?.payments[i]?.total_value;
    }

    if (data?.total_value - totalPayed > 0) {
      return notification.warning({ message: "Há valores pendentes" });
    }

    closePayment();

    return totalPayed;
  };

  const submitFinancialResponsible = async () => {
    try {
      await container
        .get<RemoteBills>(TypesAutomatiza.RemoteBills)
        .updateFinancialResponsible({
          financialResponsibleId: financialResponsible.id,
          billId,
        });

      setAllowEditFinancialRsp(false);
    } catch (err) {
      createToast({ message: "Houve um erro ao atualizar o responsável" });
    } finally {
      createToast({
        message: "Responsável financeiro atualizado com sucesso!",
      });
    }
  };

  useEffect(() => {
    data?.payments?.map((item) => {
      if (item?.block > higherBlock) {
        setHigherBlock(item?.block);
      }
    });

    setFinancialResponsible({
      id: data?.financialResponsible?.id,
    });
  }, [data, reload, higherBlock]);

  useEffect(() => {
    setBlockArr(Array.from(Array(higherBlock).keys()));
  }, [higherBlock]);

  useEffect(() => {
    paymentMethods?.length > 0 && filterMethods();
  }, [paymentMethods]);

  const submitPayment = useCallback(() => {
    if (cashiers.length === 0) {
      return notification.warning({
        message: "Nenhum caixa diário aberto",
      });
    }

    if (
      paymentMethods.find(
        (method) => method?.id === formData?.paymentMethodId
      ) !== "NÃO" &&
      !formData?.installments
    ) {
      return notification.warning({
        message: "Selecione a quantidade de parcelas",
      });
    }

    const paylaod = {
      budgetPaymentId: formData?.budgetPaymentId,
      installments: formData?.installments,
      installmentsValue: convertIntlCurrency(formData?.installmentsValue),
      billId,
      expirationDate: formData.expirationDate,
      paymentMethodId: formData.paymentMethodId,
      acquirerId: formData?.acquirerId,
      installments_without_password: formData?.installments_without_password,
      flagId: formData?.flagId,
      paymentMethodFlagId: formData?.paymentMethodFlagId,
      nsuDocument: formData?.nsuDocument,
      paymentMethodFlagInstallmentId: formData?.paymentMethodFlagInstallmentId,
    };

    mutate(paylaod, {
      onSuccess: () => {
        queryClient.invalidateQueries(["bills"]);
        queryClient.invalidateQueries(["paymentsPreview"]);
        setFormData({
          expirationDate: moment(),
        });
        return notification.success({
          message: "Pagamento adicionado com sucesso!",
        });
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          if (window.confirm(err.response.data.message)) {
            mutate({ ...paylaod, maxParcelas: true });
            setFormData({
              expirationDate: moment(),
            });
          }

          return;
        }

        verifyErrors(err.response.data.message);

        queryClient.invalidateQueries(["bills"]);
      },
    });
  }, [formData, billId]);

  return (
    <Container>
      <div className="uk-margin-top">
        <header>
          <div>
            <h3 className="uk-margin-remove">
              Pagamento da venda, código:&nbsp;{data?.tag}
            </h3>
            <strong>
              Data:&nbsp;{moment(new Date()).format("DD/MM/YYYY - HH:mm")}
              &nbsp;Cliente:&nbsp;
              {data?.client?.name}
            </strong>
          </div>
          <div>
            <label className="uk-margin-right">Resp. financeiro</label>
            {!allowEditFinancialRsp ? (
              <label
                className="uk-link"
                onClick={() => setAllowEditFinancialRsp(true)}
              >
                Alterar
              </label>
            ) : (
              <>
                <span
                  className="uk-link uk-margin-right"
                  onClick={() => submitFinancialResponsible()}
                >
                  Salvar
                </span>
                <span
                  className="uk-link"
                  onClick={() => {
                    setAllowEditFinancialRsp(false);
                  }}
                >
                  Cancelar
                </span>
              </>
            )}

            {users.data && users.data.length > 0 && (
              <FormHandler
                initialData={financialResponsible}
                onChangeForm={{
                  callbackResult: (data) => setFinancialResponsible(data),
                }}
              >
                <Select
                  disabled={!allowEditFinancialRsp}
                  menuPlacement="bottom"
                  name="id"
                  options={users.data?.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  onlyOneValue
                  value={financialResponsible.id}
                />
              </FormHandler>
            )}
          </div>
        </header>
        <hr />
        <section classNamme="payment-detail-container uk-padding uk-shadow-small">
          <div className="uk-flex">
            <section className="uk-width-1-5">
              <CardPanel
                methods={debitMethods}
                setFormData={setFormData}
                formData={formData}
                bill={data}
                title="Débito"
              />
              <div className="uk-margin-top">
                <CardPanel
                  methods={creditMethods}
                  title="Crédito"
                  setFormData={setFormData}
                  formData={formData}
                  bill={data}
                />
              </div>
            </section>
            <NonTefPanel
              methods={nonTefMethods}
              setFormData={setFormData}
              formData={formData}
              bill={data}
            />
            <DetailsPanel
              bill={data}
              formData={formData}
              setFormData={setFormData}
              submit={submitPayment}
            />
            <ResumePanel bill={data} formData={formData} />
          </div>
        </section>
        <hr />
        <PaymentsPreviewComponent {...data} setData={setFormData} />
        <hr />
        {blockArr?.length > 0 &&
          blockArr?.map((i) => (
            <ProductsPanel
              key={i}
              payments={data?.payments?.filter((item) => item?.block === i + 1)}
              reload={reload}
              setReload={setReload}
              remove={data?.status === "BAIXADA" ? false : true}
              billId={data?.id}
            />
          ))}
        <footer className="uk-margin-top uk-flex uk-flex-right">
          <Button onClick={() => setVisible(false)} text="Salvar" />

          {endBillPermission && (
            <Button onClick={() => verifyPayment()} text="Finalizar" />
          )}
        </footer>
      </div>
    </Container>
  );
});

export default AddBillPayment;
