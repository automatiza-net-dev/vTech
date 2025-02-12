// @ts-nocheck
// Core
import React, { memo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";

// Services
import { financesService } from "@/OLD/services/finances.service";

// Hooks
import { usePaymentMethods } from "@/OLD/hooks/usePaymentMethods";
import { usePlans } from "@/OLD/hooks/usePlans";
import { useTutor } from "@/OLD/hooks/useTutor";
import { useProfile } from "@/OLD/hooks/useProfile";

// Utils
import moment from "moment";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import { currencyFormatter } from "@/OLD/components/Budget";
import { normalizeStr } from "@/OLD/utils/normalizeString";

// Components
import { Container } from "./styles";
import {
  Input,
  DatePicker,
  Select,
  Button,
  AutoComplete,
  Radio,
} from "antd";
import Installments from "./Installments";

import { useSuppliers } from "@/OLD/hooks/useSuppliers";
import { useToast } from "infinity-forge";
const { Option } = Select;
const { Group } = Radio;

export const Create = memo(function Create({ type }) {
  const [submitStage, setSubmitStage] = useState(false);
  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formatedTutors, setFormatedTutors] = useState([]);
  const [paymentMethodSearch, setPaymentMethodSearch] = useState("");
  const [methodOptions, setMethodOptions] = useState([]);
  const [plansOptions, setPlansOptions] = useState([]);
  const [planSearch, setPlanSearch] = useState("");
  const [data, setData] = useState({
    issueDate: moment(new Date()),
    feeValue: currencyFormatter(0),
    feePercentage: 0,
    discountPercentage: 0,
    discountValue: currencyFormatter(0),
    originalValue: currencyFormatter(0),
  });

  const { paymentMethods } = usePaymentMethods(false, false);
  const { plans } = usePlans();
  const { tutors } = useTutor(false, false);
  const { suppliers } = useSuppliers(false, false);
  const { clinic } = useProfile();

  const router = useRouter();

  const {createToast} = useToast()

  const submitInstallments = useCallback(async () => {
    setLoading(true);
    let error = false;

    const items = installments.map((installment) => ({
      ...installment,
      originalValue: convertIntlCurrency(installment?.originalValue),
      feeValue: convertIntlCurrency(installment?.feeValue),
      competenceDate: moment(installment?.competenceDate).format("MM/YYYY"),
    }));

    financesService
      .createMultiple({ items })
      .then((_res) => {

        createToast({ status: "success", message: `Parcelas salvas com sucesso!` })
       
        router.back();
      })
      .catch((_err) => {
        error = true;

        return createToast({ status: "error", message: "Erro ao salvar parcela" })
      });
  }, [installments]);

  const formatTutors = () => {
    const formattedTutors =
      tutors?.map((tutor) => ({
        ...tutor,
        value: tutor?.name,
        key: tutor?.id,
      })) || [];

    const formattedSuppliers = Array.isArray(suppliers)
      ? suppliers.map((supplier) => ({
          ...supplier,
          value: supplier?.name,
          key: supplier?.id,
        }))
      : [];

    const formattedClients = [...formattedTutors, ...formattedSuppliers];

    const sortedClients = formattedClients.sort((a, b) => {
      const nameA = a.value.toUpperCase();
      const nameB = b.value.toUpperCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    setFormatedTutors(sortedClients);
  };

  useEffect(() => {
    if (tutors?.length > 0 || Array.isArray(suppliers)) {
      formatTutors();
    }
  }, [tutors, suppliers]);

  useEffect(() => {
    paymentMethods?.length > 0 &&
      setMethodOptions(
        paymentMethods.map((method) => {
          return {
            ...method,
            value: method?.description,
          };
        })
      );
  }, [paymentMethods]);

  useEffect(() => {
    plans?.length > 0;
    setPlansOptions(
      plans
        ?.map((plan) => {
          return {
            ...plan,
            value: plan?.description,
            key: plan?.id,
          };
        })
        .filter((planOption) => {
          if (type === "receive") {
            return planOption.type === "CREDITO";
          } else {
            return planOption.type === "DEBITO";
          }
        })
    );
  }, [plans]);

  useEffect(() => {
    data?.installments &&
      setInstallments(
        Array.from(Array(parseInt(data?.installments))).map((_, index) => {
          return {
            qtyInstallments: installments?.length,
            clientId: data?.clientId,
            type: type === "receive" ? "CREDITO" : "DEBITO",
            accountPlanId: data?.accountPlanId,
            paymentMethodId: data?.paymentMethodId,
            document: data?.document,
            historic: data?.historic,
            issueDate: data?.issueDate,
            expirationDate: moment(data?.expirationDate).add(
              index * 1,
              "month"
            ),
            originalValue: data?.originalValue,
            accept: data?.accept,
            installment: index + 1,
            originFlag: "FINANCEIRO",
            paymentValue: data?.paymentValue,
            competenceDate:
              data?.parcType === "parc"
                ? moment(data?.expirationDate)
                : moment(data?.expirationDate).add(index * 1, "month"),
            fiscalNote: data?.fiscalNote,
            reconciled: false,
            checkingAccountId: data?.checkingAccountId,
            feeValue: currencyFormatter(data?.feeValue),
            feePercentage: data?.feePercentage,
            observation: data?.observation,
            userDocument: data?.userDocument,
            nsuDocument: data?.nsuDocument,
            barCode: data?.barCode,
            bank: data?.bank,
            agency: data?.agency,
            account: data?.account,
            accept: "SIM",
          };
        })
      );
  }, [data]);

  return (
    <Container className="uk-padding">
      <h3 className="uk-margin-remove">
        Lançamento de títulos ({type === "receive" ? "Crédito" : "Débito"})
      </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (!data?.clientId && clinic?.unitConfig?.requires_finance_client) {
            return createToast({message:"Selecione um títular para o título",status:"warning"})
             
          }

          if (!data?.paymentMethodId) {
            return createToast({message:"Verifique o campo obrigatório: Forma Pagamento",status:"warning"})


            
          }

          if (!data?.accountPlanId) {
            return createToast({message:"Verifique o campo obrigatório: Plano Contas",status:"warning"})

           
          }

          !submitStage ? setSubmitStage(true) : submitInstallments();
        }}
      >
        <div className="form-body uk-padding uk-margin-top">
          <div className="uk-flex">
            <div className="uk-margin-small-right">
              <label> Data Emissão </label>
              <DatePicker
                required
                className="uk-width-1-1"
                format="DD/MM/YYYY"
                onChange={(e) => setData({ ...data, issueDate: e })}
                value={data?.issueDate}
              />
            </div>
            <div className="uk-margin-small-right">
              <label> Data 1º parcela </label>
              <DatePicker
                required
                className="uk-width-1-1"
                format="DD/MM/YYYY"
                onChange={(e) => setData({ ...data, expirationDate: e })}
                value={data?.expirationDate}
              />
            </div>
            <div className="uk-margin-right">
              <label>Documento</label>
              <Input
                value={data?.document}
                onChange={(e) => setData({ ...data, document: e.target.value })}
              />
            </div>
            <div className="uk-margin-right">
              <label>Nota fiscal</label>
              <Input
                value={data?.fiscalNote}
                onChange={(e) =>
                  setData({ ...data, fiscalNote: e.target.value })
                }
              />
            </div>
            <div>
              <label>Tipo Parcelamento</label>
              <br />
              <Group
                defaultValue="recorrente"
                onChange={(e) => setData({ ...data, parcType: e.target.value })}
              >
             
                  <Radio value="rec">Recorrente</Radio>
              
                  <Radio value="parc">Parcelamento</Radio>
              </Group>
            </div>
          </div>
          <div className="uk-margin-small-right uk-width-1-1">
            <label>Nome Titular</label>
            <AutoComplete
              required
              allowClear
              onClear={() => {
                const newObj = { ...data, userName: "" };
                delete newObj?.clientId;
                setData(newObj);
              }}
              options={formatedTutors}
              className="uk-width-1-1"
              value={data?.userName}
              onChange={(e) => {
                setData({ ...data, userName: e, clientId: null });
              }}
              onSelect={(inputValue, option) => {
                setData({
                  ...data,
                  userName: inputValue,
                  clientId: option?.id,
                });
                if (option?.accountPlan && type !== "receive") {
                  setPlanSearch(option?.accountPlan?.description);
                  setData((prv) => ({
                    ...prv,
                    accountPlanId: option?.accountPlan?.id,
                  }));
                }
              }}
              filterOption={(inputValue, option) => {
                if (
                  normalizeStr(option.value.toUpperCase()).includes(
                    normalizeStr(inputValue.toUpperCase())
                  ) ||
                  option?.tutor?.document?.includes(inputValue)
                ) {
                  return option;
                }
              }}
            />
          </div>
          <div className="uk-margin-top uk-flex">
            <div className="uk-margin-small-right uk-width-1-4">
              <label>Valor parcela</label>
              <Input
                required
                value={data?.originalValue}
                onChange={(e) =>
                  setData({
                    ...data,
                    originalValue: currencyFormatter(
                      convertIntlCurrency(e.target.value)
                    ),
                  })
                }
              />
            </div>
            <div className="uk-margin-small-right uk-width-1-4">
              <label>Nº Parcelas</label>
              <Input
                type="number"
                required
                value={data?.installments}
                onChange={(e) =>
                  setData({ ...data, installments: e.target.value })
                }
              />
            </div>
            <div className="uk-margin-small-right uk-width-1-2">
              <label>Forma Pagamento</label>
              <AutoComplete
                onChange={(value) => setPaymentMethodSearch(value)}
                className="uk-width-1-1"
                options={methodOptions}
                onSelect={(_, option) => {
                  setPaymentMethodSearch(option.description);
                  setData({ ...data, paymentMethodId: option.id });
                }}
                filterOption={(value, option) =>
                  normalizeStr(option.description.toUpperCase()).includes(
                    normalizeStr(value.toUpperCase())
                  )
                }
              />
              {/*
                {paymentMethods.length > 0 &&
                  paymentMethods.map((method, i) => (
                    <Option key={i} value={method.id}>
                      {method?.description}
                    </Option>
                  ))}
                    */}
            </div>
            <div className="uk-width-1-2">
              <label>Plano Contas</label>
              <AutoComplete
                required
                value={planSearch}
                className="uk-width-1-1"
                options={plansOptions}
                onChange={(value) => setPlanSearch(value)}
                onSelect={(_, o) => {
                  setData({ ...data, accountPlanId: o?.id });
                  setPlanSearch(o?.description);
                }}
                filterOption={(value, option) =>
                  normalizeStr(option.description.toUpperCase()).includes(
                    normalizeStr(value.toUpperCase())
                  )
                }
              />
              {/*
                {plans.length > 0 &&
                  plans.map((plan) => (
                    <Option value={plan?.id}>{plan?.description}</Option>
                  ))}
                  */}
            </div>
          </div>
          <div className="uk-flex uk-margin-top">
            {/*
            <div className="uk-margin-small-right">
              <label>Banco</label>
              <Input
                value={data?.bank}
                onChange={(e) => setData({ ...data, bank: e.target.value })}
              />
            </div>
            <div className="uk-margin-small-right">
              <label>Agência</label>
              <Input
                value={data?.agency}
                onChange={(e) => setData({ ...data, agency: e.target.value })}
              />
            </div>
            <div className="uk-margin-small-right">
              <label>Conta</label>
              <Input
                value={data?.account}
                onChange={(e) => setData({ ...data, account: e.target.value })}
              />
            </div>
            */}
            {/*
            <div>
              <label>CPF Portador</label>
              <Input
                value={data?.userDocument}
                onChange={(e) =>
                  setData({ ...data, userDocument: e.target.value })
                }
              />
            </div>
            */}
          </div>
          <div className="uk-flex uk-margin-top">
            <div className="uk-margin-small-right">
              <label>R$ Juros</label>
              <Input
                required
                value={data?.feeValue}
                onChange={(e) =>
                  setData({
                    ...data,
                    feeValue: currencyFormatter(
                      convertIntlCurrency(e.target.value)
                    ),
                  })
                }
              />
            </div>
            <div className="uk-margin-small-right">
              <label>% Taxa Juros</label>
              <Input
                required
                value={data?.feePercentage}
                onChange={(e) =>
                  setData({ ...data, feePercentage: e.target.value })
                }
              />
            </div>
            <div className="uk-margin-small-right">
              <label>R$ Desconto</label>
              <Input
                required
                value={data?.discountValue}
                onChange={(e) =>
                  setData({
                    ...data,
                    discountValue: currencyFormatter(
                      convertIntlCurrency(e.target.value)
                    ),
                  })
                }
              />
            </div>
            <div className="uk-margin-small-right">
              <label>% Desconto</label>
              <Input
                required
                value={data?.discountPercentage}
                onChange={(e) =>
                  setData({ ...data, discountPercentage: e.target.value })
                }
              />
            </div>
            <div className="uk-margin-small-right">
              <label>Nº Comprovante / Nsu</label>
              <Input
                onChange={(e) =>
                  setData({ ...data, nsuDocument: e.target.value })
                }
                value={data?.nsuDocument}
              />
            </div>
          </div>
          <div className="uk-margin-top">
            <label>Histórico</label>
            <Input
              value={data?.historic}
              onChange={(e) => setData({ ...data, historic: e.target.value })}
            />
          </div>
        </div>
        {submitStage &&
          installments?.length > 0 &&
          installments?.map((_, i) => (
            <Installments
              setInstallments={setInstallments}
              installments={installments}
              index={i}
              paymentMethods={paymentMethods}
              plans={plansOptions}
            />
          ))}
        <footer className="uk-margin-top uk-flex uk-flex-right">
          <Button type="primary" htmlType="submit" className="uk-margin-right">
            {submitStage ? "Salvar" : "Avançar"}
          </Button>
          <Button htmlType="button" onClick={() => router.back()}>
            Sair
          </Button>
        </footer>
      </form>
    </Container>
  );
});

export default Create;
