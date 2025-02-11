// @ts-nocheck
// Core
import React, { memo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";

// Utils
import moment from "moment";

// Services
import { bankingService } from "@/OLD/services/banking.service";

// Hooks
import { usePlans } from "@/OLD/hooks/usePlans";
import { useCheckingAccounts } from "@/OLD/hooks/useCheckingAccounts";
import { usePaymentMethods } from "@/OLD/hooks/usePaymentMethods";
import { useTutor } from "@/OLD/hooks/useTutor";

// Components
import { Container } from "./styles";
import { Button } from "antd";
import { Input, DatePicker, Radio, Select, AutoComplete } from "antd";
import { useToast } from "infinity-forge";
const { Group } = Radio;
const { Option } = Select;

const Update = memo(function Update({
  banking,
  reload,
  setReload,
  setVisible,
}) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [formatedTutors, setFormatedTutors] = useState([]);
  const { plans } = usePlans();
  const { checkingAccounts } = useCheckingAccounts();
  const { tutors } = useTutor(false, false);
  const { paymentMethods } = usePaymentMethods(false, false);
  const router = useRouter();

  const { createToast } = useToast();

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

  useEffect(() => {
    banking &&
      setData({
        issueDate: banking?.issue_date,
        competenceDate: moment(banking?.competence_date, "MM/YYYY"),
        reconciled: JSON.stringify(banking?.reconciled),
        type: banking?.type,
        document: banking?.document,
        documentValue: banking?.document_value,
        historic: banking?.historic,
        feeValue: banking?.fee_value,
        feePercentage: banking?.fee_percentage,
        discountValue: banking?.discount_value,
        discountPercentage: banking?.discount_percentage,
        installment: banking?.installment,
        accountPlanId: banking?.plan?.id,
        paymentMethodId: banking?.method?.id,
        originAccount: banking?.checkingAccount?.id,
        fiscalNote: banking?.fiscal_note,
        accountPlanId: banking?.accountPlan?.id,
        paymentMethodId: banking?.paymentMethod?.id,
        clientId: banking?.client?.id,
        userName: banking?.client?.name,
      });
  }, [banking]);

  const submitUpdate = useCallback(() => {
    setLoading(true);
    let error = false;
    bankingService
      .updateBanking(banking?.id, {
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
        originFlag: "FINANCEIRO",
        competenceDate: moment(data?.competenceDate).format("MM/YYYY"),
        fiscalNote: data?.fiscalNote,
      })
      .then((_res) => {
        createToast({
          status: "success",
          message: "Registro atualizado com sucesso!",
        });
      })
      .catch((err) => {
        setLoading(false);
        error = true;
        const message = err?.response?.data?.errors[0].message;
        if (message) {
          createToast({ status: "error", message });
          return;
        }
        return createToast({
          status: "error",
          message: "Houve um erro ao salvar a transação...",
        });
      })
      .finally(() => {
        if (!error) {
          setData({});
          setLoading(false);
          setVisible(false);
          setReload(!reload);
        }
      });
  }, [data, banking?.id]);

  return (
    <Container>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitUpdate();
        }}
      >
        <div className="form-body">
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
                value={data?.reconciled}
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
              <Input readOnly value={data?.type?.toLowerCase()} />
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
              <label>Taxa (%)</label>
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
              <label>Desconto (%)</label>
              <Input
                type="number"
                value={data?.discountPercentage}
                onChange={(e) =>
                  setData({ ...data, discountPercentage: e.target.value })
                }
              />
            </div>
            <div className="uk-width-1-6">
              <label>Número parcela</label>
              <Input
                readOnly
                type="number"
                value={data?.installment}
                onChange={(e) =>
                  setData({ ...data, installment: e.target.value })
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
        <hr />
        <footer className="uk-flex uk-flex-right uk-margin-top ">
          <Button
            htmlType="button"
            className="uk-margin-right"
            onClick={() => setVisible(false)}
          >
            Voltar
          </Button>
          <Button type="primary" htmlType="submit">
            Salvar
          </Button>
        </footer>
      </form>
    </Container>
  );
});

export default Update;
