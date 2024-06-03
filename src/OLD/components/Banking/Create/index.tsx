// @ts-nocheck
// Core
import React, { memo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";

// Utils
import moment from "moment";

// Hooks
import { usePlans } from "@/OLD/hooks/usePlans";
import { useCheckingAccounts } from "@/OLD/hooks/useCheckingAccounts";
import { usePaymentMethods } from "@/OLD/hooks/usePaymentMethods";
import { useTutor } from "@/OLD/hooks/useTutor";

// Services
import { bankingService } from "@/OLD/services/banking.service";

// Components
import { Container } from "./styles";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";
import {
  Input,
  DatePicker,
  Radio,
  Select,
  AutoComplete,
  notification,
} from "antd";
const { Group } = Radio;
const { Option } = Select;

const Create = memo(function FormChild({}) {
  const [data, setData] = useState({ type: "CREDITO", reconciled: "true" });
  const [loading, setLoading] = useState(false);
  const [formatedTutors, setFormatedTutors] = useState([]);
  const { plans } = usePlans();
  const { checkingAccounts } = useCheckingAccounts();
  const { tutors } = useTutor(false, false);
  const { paymentMethods } = usePaymentMethods(false, false);
  const router = useRouter();

  const createBanking = useCallback(() => {
    setLoading(true);
    let error = false;
    bankingService
      .createBanking({
        clientId: data?.clientId,
        type: data?.type,
        accountPlanId: data?.accountPlanId,
        paymentMethodId: data?.paymentMethodId,
        checkingAccountId: data?.originAccount,
        document: data?.document,
        historic: data?.historic,
        issueDate: moment(data?.issueDate).toISOString(),
        documentValue: data?.documentValue,
        feeValue: data?.feeValue,
        feePercentage: data?.feePercentage,
        discountValue: data?.discountValue,
        discountPercentage: data?.discountPercentage,
        reconciled: data?.reconciled,
        installment: 1,
        originFlag: "BANCARIO",
        competenceDate: moment(data?.competenceDate).format("MM/YYYY"),
        fiscalNote: data?.fiscalNote,
      })
      .then((_res) =>
        notification.success({ message: "Transação salva com sucesso" })
      )
      .catch((err) => {
        setLoading(false);
        error = true;
        const message = err?.response?.data?.errors[0].message;
        if (message) {
          return notification.error({ message });
        }
        return notification.error({
          message: "Houve um erro ao salvar a transação...",
        });
      })
      .finally(() => {
        if (!error) {
          setLoading(false);
          setData({});
          router.back();
        }
      });
  }, [data]);

  const createTransaction = useCallback(() => {
    setLoading(true);
    let error = false;
    bankingService
      .createBanking({
        clientId: data?.clientId,
        type: "DEBITO",
        accountPlanId: data?.accountPlanId,
        paymentMethodId: data?.paymentMethodId,
        checkingAccountId: data?.originAccount,
        document: data?.document,
        historic: data?.historic,
        issueDate: moment(data?.issueDate).toISOString(),
        documentValue: data?.documentValue,
        feeValue: data?.feeValue,
        feePercentage: data?.feePercentage,
        discountValue: data?.discountValue,
        discountPercentage: data?.discountPercentage,
        reconciled: data?.reconciled,
        installment: data?.installment,
        originFlag: "BANCARIO",
        competenceDate: moment(data?.competenceDate).format("MM/YYYY"),
        fiscalNote: data?.fiscalNote,
      })
      .catch((err) => {
        error = err?.response?.data?.errors[0].message;
      });

    bankingService
      .createBanking({
        clientId: data?.clientId,
        type: "CREDITO",
        accountPlanId: data?.accountPlanId,
        paymentMethodId: data?.paymentMethodId,
        checkingAccountId: data?.destinyAccount,
        document: data?.document,
        historic: data?.historic,
        issueDate: moment(data?.issueDate).toISOString(),
        documentValue: data?.documentValue,
        feeValue: data?.feeValue,
        feePercentage: data?.feePercentage,
        discountValue: data?.discountValue,
        discountPercentage: data?.discountPercentage,
        reconciled: data?.reconciled,
        installment: data?.installment,
        originFlag: "BANCARIO",
        competenceDate: moment(data?.competenceDate).format("MM/YYYY"),
        fiscalNote: data?.fiscalNote,
      })
      .catch((err) => {
        error = err?.response?.data?.errors[0].message;
      });

    if (error) {
      return notification.error({ message: error });
    } else {
      setLoading(false);
      setData({});
      router.back();
      return notification.success({
        message: "Transação salva com sucesso",
      });
    }
  });

  const formatTutors = () => {
    setFormatedTutors(
      tutors.map((tutor) => {
        return {
          ...tutor,
          value: tutor?.name,
        };
      })
    );
  };

  useEffect(() => {
    tutors?.length > 0 && formatTutors();
  }, [tutors]);

  return (
    <Container className="uk-padding">
      <h3 className="uk-margin-remove">Movimentação bancária</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          data?.type !== "transaction" ? createBanking() : createTransaction();
        }}
      >
        <div className="form-body uk-padding uk-margin-top">
          <div className="uk-flex">
            <div className="uk-margin-small-right uk-width-1-1">
              <label>CPF/CNPJ ou nome do Titular</label>
              <AutoComplete
                required
                options={formatedTutors}
                className="uk-width-1-1"
                value={data?.userName}
                onChange={(e) => setData({ ...data, userName: e })}
                onSelect={(inputValue, option) =>
                  setData({
                    ...data,
                    userName: inputValue,
                    clientId: option?.id,
                  })
                }
                filterOption={(inputValue, option) => {
                  if (
                    option?.name?.includes(inputValue) ||
                    option?.tutor?.document?.includes(inputValue)
                  ) {
                    return option;
                  }
                }}
              />
            </div>
            <div className="uk-margin-right">
              <label>Data emissão</label>
              <DatePicker
                required
                className="uk-width-1-1"
                format="DD/MM/YYYY"
                value={data?.issueDate ? moment(data.issueDate) : ""}
                onChange={(e) => setData({ ...data, issueDate: e })}
              />
            </div>
            <div>
              <label>Mês/Ano Competência</label>
              <DatePicker
                required
                className="uk-width-1-1"
                format="MM/YYYY"
                picker="month"
                value={data?.competenceDate ? moment(data?.competenceDate) : ""}
                onChange={(e) => setData({ ...data, competenceDate: e })}
              />
            </div>
          </div>
          <div className="uk-flex uk-margin-top">
            <div className="uk-margin-xlarge-right">
              <label>Conciliado</label>
              <br />
              <Group
                defaultValue="true"
                onChange={(e) =>
                  setData({ ...data, reconciled: e.target.value })
                }
              >
                <Radio value="true">Sim</Radio>
                <Radio value="false">Não</Radio>
              </Group>
            </div>
            <div className="uk-margin-left">
              <label>Tipo Lançamento</label>
              <br />
              <Group
                defaultValue="CREDITO"
                onChange={(e) => setData({ ...data, type: e.target.value })}
              >
                <Radio value="CREDITO">Crédito</Radio>
                <Radio value="DEBITO">Débito</Radio>
                <Radio value="transaction">Transferência</Radio>
              </Group>
            </div>
          </div>
          <div className="uk-flex uk-margin-top">
            <div className="uk-margin-right">
              <label>Documento</label>
              <Input
                onChange={(e) => setData({ ...data, document: e.target.value })}
                value={data?.document}
              />
            </div>
            <div className="uk-margin-right">
              <label>Valor Lançamento</label>
              <Input
                type="number"
                onChange={(e) =>
                  setData({ ...data, documentValue: e.target.value })
                }
                value={data?.documentValue}
              />
            </div>
            <div>
              <label>Historico</label>
              <Input
                onChange={(e) => setData({ ...data, historic: e.target.value })}
                value={data?.historic}
              />
            </div>
          </div>
          <div className="uk-flex uk-margin-top">
            <div className="uk-width-1-6 uk-margin-right">
              <label>Taxa</label>
              <Input
                type="number"
                value={data?.feeValue}
                onChange={(e) => setData({ ...data, feeValue: e.target.value })}
              />
            </div>
            <div className="uk-width-1-6 uk-margin-right">
              <label>Taxa (Porcentagem)</label>
              <Input
                type="number"
                value={data?.feePercentage}
                onChange={(e) =>
                  setData({ ...data, feePercentage: e.target.value })
                }
              />
            </div>
            <div className="uk-width-1-6 uk-margin-right">
              <label>Desconto</label>
              <Input
                type="number"
                value={data?.discountValue}
                onChange={(e) =>
                  setData({ ...data, discountValue: e.target.value })
                }
              />
            </div>
            <div className="uk-width-1-6 uk-margin-right">
              <label>Desconto (porcentagem)</label>
              <Input
                type="number"
                value={data?.discountPercentage}
                onChange={(e) =>
                  setData({ ...data, discountPercentage: e.target.value })
                }
              />
            </div>
          </div>
          <div className="uk-flex uk-margin-top uk-width-1-1">
            <div className="uk-margin-right uk-width-1-4">
              <label>Plano Contas</label>
              <Select
                className="uk-width-1-1"
                value={data?.accountPlanId}
                onChange={(e) => setData({ ...data, accountPlanId: e })}
              >
                {plans?.length > 0 &&
                  plans?.map((plan, i) => (
                    <Option key={i} value={plan?.id}>
                      {plan?.description}
                    </Option>
                  ))}
              </Select>
            </div>
            <div className="uk-margin-small-right uk-width-1-4">
              <label>Forma Pagamento</label>
              <Select
                required
                className="uk-width-1-1"
                value={data?.paymentMethodId}
                onChange={(e) => {
                  setData({ ...data, paymentMethodId: e });
                }}
              >
                {paymentMethods.length > 0 &&
                  paymentMethods.map((method, i) => (
                    <Option key={i} value={method.id}>
                      {method?.description}
                    </Option>
                  ))}
              </Select>
            </div>
            <div className="uk-margin-right uk-width-1-4">
              <label>
                {data?.type === "transaction"
                  ? "Conta Corrente Origem"
                  : "Conta Corrente"}
              </label>
              <Select
                className="uk-width-1-1"
                value={data?.originAccount}
                onChange={(e) => setData({ ...data, originAccount: e })}
              >
                {checkingAccounts?.length > 0 &&
                  checkingAccounts?.map((account, i) => (
                    <Option key={i} value={account?.id}>
                      {account?.description}
                    </Option>
                  ))}
              </Select>
            </div>
            {data?.type === "transaction" && (
              <div className="uk-width-1-4">
                <label>Conta corrente destino</label>
                <Select
                  className="uk-width-1-1"
                  value={data?.destinyAccount}
                  onChange={(e) => setData({ ...data, destinyAccount: e })}
                >
                  {checkingAccounts?.length > 0 &&
                    checkingAccounts?.map((account, i) => (
                      <Option key={i} value={account?.id}>
                        {account?.description}
                      </Option>
                    ))}
                </Select>
              </div>
            )}
          </div>
          <div className="uk-margin-top uk-width-1-3">
            <label>Nota Fiscal</label>
            <Input
              value={data?.fiscalNote}
              onChange={(e) => setData({ ...data, fiscalNote: e.target.value })}
            />
          </div>
        </div>
        <footer className="uk-flex uk-flex-right uk-margin-top ">
          <CustomButton classCallback="uk-margin-right" type="submit">
            Salvar
          </CustomButton>
          <CustomButton onClick={() => router.back()}>Voltar</CustomButton>
        </footer>
      </form>
    </Container>
  );
});

export default Create;
