import React, { useState, useCallback, useEffect } from "react";

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
import { Input, DatePicker, Button, AutoComplete, Radio } from "antd";
import Installments from "./Installments";

import { useSuppliers } from "@/OLD/hooks/useSuppliers";
import {
  FormHandler,
  useToast,
  Select as SelectInfinityForge,
} from "infinity-forge";

const { Group } = Radio;

export default function Create({ type = "", setVisible, setReload }: any) {
  const [submitStage, setSubmitStage] = useState(false);
  const [installments, setInstallments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formatedTutors, setFormatedTutors] = useState<any[]>([]);
  const [paymentMethodSearch, setPaymentMethodSearch] = useState("");
  const [methodOptions, setMethodOptions] = useState<any[]>([]);
  const [plansOptions, setPlansOptions] = useState<any[]>([]);
  const [planSearch, setPlanSearch] = useState("");
  const [data, setData] = useState<any>({
    issueDate: moment(new Date()),
    feeValue: currencyFormatter(0),
    feePercentage: 0,
    discountPercentage: 0,
    discountValue: currencyFormatter(0),
    originalValue: currencyFormatter(0),
  });
  const [titleType, setTitleType] = useState("DEBITO");
  const { createToast } = useToast();

  const { paymentMethods } = usePaymentMethods(false, false);
  const { plans } = usePlans();
  const { tutors } = useTutor(false, false);
  const { suppliers } = useSuppliers(false, false);

  const { clinic } = useProfile();

  const submitInstallments = useCallback(async () => {
    setLoading(true);
    let error = false;

    const items = installments.map((installment) => ({
      ...installment,
      type: titleType,
      originalValue: convertIntlCurrency(installment?.originalValue),
      feeValue: convertIntlCurrency(installment?.feeValue),
      competenceDate: moment(installment?.competenceDate).format("MM/YYYY"),
    }));

    financesService
      .createMultiple({ items })
      .then((_res) => {
        setVisible(false);
        setData({
          issueDate: moment(new Date()),
          feeValue: currencyFormatter(0),
          feePercentage: 0,
          discountPercentage: 0,
          discountValue: currencyFormatter(0),
          originalValue: currencyFormatter(0),
        });
        setSubmitStage(false);
        setPlanSearch("");
        setPaymentMethodSearch("");
        createToast({
          message: "Parcelas salvas com sucesso!",
          status: "success",
        });
      })
      .catch((err) => {
        return createToast({
          message:
            err.response?.data?.message || "Verifique os campos da parcela",
          status: "error",
        });
      });
  }, [installments, titleType]);

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

    const sortedClients = formattedClients.sort((a: any, b: any) => {
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
          paymentMethods;
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
    type === "receive" && setTitleType("CREDITO");
    type === "payment" && setTitleType("DEBITO");
  }, [type]);

  useEffect(() => {
    data?.installments &&
      setInstallments(
        Array.from(Array(parseInt(data?.installments))).map((_, index) => {
          return {
            qtyInstallments: installments?.length,
            clientId: data?.clientId,
            type: titleType,
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
            // accept: data?.accept,
            installment: index + 1,
            originFlag: "FINANCEIRO",
            paymentValue: data?.paymentValue,
            competenceDate:
              data?.parcType === "parc"
                ? moment(data?.issueDate)
                : moment(data?.issueDate).add(index * 1, "month"),
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
            accept: "NAO",
          } as any;
        })
      );
  }, [data, titleType]);

  return (
    <>
      {!type && (
        <Container>
          <div className="uk-margin-xlarge-right">
            <Group
              value={titleType}
              onChange={(e) => {
                setTitleType(e.target.value);
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
                      return planOption.type === e.target.value;
                    })
                );
              }}
            >
              <Radio value="DEBITO">À pagar</Radio>
              <Radio value="CREDITO">À receber</Radio>
            </Group>
          </div>
        </Container>
      )}
      <Container className="">
        {/*
      <h3 className="uk-margin-remove">
        Lançamento de títulos ({type === "receive" ? "Crédito" : "Débito"})
      </h3>
      */}
        <FormHandler disableEnterKeySubmitForm>
          <div>
            <div className="form-body uk-padding uk-margin-top">
              <div className="uk-flex">
                <div className="uk-margin-small-right">
                  <label> Data Emissão </label>
                  <DatePicker
                    className="uk-width-1-1"
                    format="DD/MM/YYYY"
                    onChange={(e) => setData({ ...data, issueDate: e })}
                    value={data?.issueDate}
                  />
                </div>
                <div className="uk-margin-small-right">
                  <label> Data 1º parcela </label>
                  <DatePicker
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
                    onChange={(e) =>
                      setData({ ...data, document: e.target.value })
                    }
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
                    onChange={(e) =>
                      setData({ ...data, parcType: e.target.value })
                    }
                  >
                    <Radio value="rec">Recorrente</Radio>

                    <Radio value="parc">Parcelamento</Radio>
                  </Group>
                </div>
              </div>
              <div className="uk-margin-small-right uk-width-1-1">
                <SelectInfinityForge
                  label="Nome Titular"
                  options={formatedTutors.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  name="select"
                  onlyOneValue
                  onChangeInput={(value) => {
                    const optionSelected = formatedTutors.find((item) => {
                      return item.id === value;
                    });

                    if (optionSelected?.accountPlan && type !== "receive") {
                      setPlanSearch(optionSelected?.accountPlan?.description);

                      setData((prv) => ({
                        ...prv,
                        accountPlanId: optionSelected?.accountPlan?.id,
                        userName: optionSelected?.name,
                        clientId: optionSelected?.id,
                      }));
                    } else {
                      setPlanSearch("");

                      setData({
                        ...data,
                        accountPlanId: undefined,
                        userName: optionSelected?.name,
                        clientId: optionSelected?.id,
                      });
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
                  <SelectInfinityForge
                    label="Forma Pagamento"
                    options={
                      methodOptions.map((item) => ({
                        label: item.description,
                        value: item.id,
                      })) || []
                    }
                    name="method_payments"
                    onlyOneValue
                    onChangeInput={(value) => {
                      const optionSelected = methodOptions.find(
                        (item) => item.id === value
                      );

                      setPaymentMethodSearch(optionSelected.description);
                      setData((prev) => ({ ...prev, paymentMethodId: value }));
                    }}
                  />
                </div>

                <div className="uk-width-1-2">
                  <label>Plano Contas</label>
                  <AutoComplete
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
                  onChange={(e) =>
                    setData({ ...data, historic: e.target.value })
                  }
                />
              </div>
            </div>
            {submitStage &&
              installments?.length > 0 &&
              installments?.map((_, i) => (
                <Installments
                  setInstallments={setInstallments as any}
                  installments={installments}
                  index={i}
                  paymentMethods={paymentMethods}
                  type={data?.parcType}
                  paymentMethodSearch={paymentMethodSearch}
                />
              ))}
            <hr />
            <footer className="uk-margin-top uk-flex uk-flex-right">
              <Button
                type="primary"
                htmlType="button"
                onClick={() => {
                  if (
                    !data?.clientId &&
                    clinic?.unitConfig?.requires_finance_client
                  ) {
                    return createToast({
                      message: "Selecione um títular para o título",
                      status: "warning",
                    });
                  }

                  if (!data?.paymentMethodId) {
                    return createToast({
                      message: "Verifique o campo obrigatório: Forma Pagamento",
                      status: "warning",
                    });
                  }

                  if (!data?.accountPlanId) {
                    return createToast({
                      message: "Verifique o campo obrigatório: Plano Contas",
                      status: "warning",
                    });
                  }

                  !submitStage ? setSubmitStage(true) : submitInstallments();
                }}
                className="uk-margin-right"
              >
                {submitStage ? "Salvar" : "Avançar"}
              </Button>
              <Button htmlType="button" onClick={() => setVisible(false)}>
                Sair
              </Button>
            </footer>
          </div>
        </FormHandler>
      </Container>
    </>
  );
}
