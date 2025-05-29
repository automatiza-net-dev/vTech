import React, { memo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";

import moment from "moment";

import { usePlans } from "@/OLD/hooks/usePlans";
import { useCheckingAccounts } from "@/OLD/hooks/useCheckingAccounts";
import { usePaymentMethods } from "@/OLD/hooks/usePaymentMethods";
import { useTutor } from "@/OLD/hooks/useTutor";

import { bankingService } from "@/OLD/services/banking.service";

import { Container } from "./styles";
import { api, Button, PageWrapper } from "infinity-forge";
import { Input, DatePicker, Radio, Select, AutoComplete } from "antd";

import {
  FormHandler,
  useToast,
  Select as SelectInfinityForge,
} from "infinity-forge";
import { useQuery } from "@/presentation/use-query/use-query";

const { Group } = Radio;
const { Option } = Select;

const Create = memo(function FormChild({}) {
  const [data, setData] = useState<any>({
    type: "CREDITO",
    reconciled: "true",
    feeValue: 0,
    feePercentage: 0,
    discountValue: 0,
    discountPercentage: 0,
  });
  const [loading, setLoading] = useState(false);
  const [formatedTutors, setFormatedTutors] = useState<any[]>([]);
  const { plans } = usePlans();
  const { checkingAccounts } = useCheckingAccounts();
  const { tutors } = useTutor(false, false);
  const { paymentMethods } = usePaymentMethods(false, false);

  const router = useRouter();
  const { createToast } = useToast();

  const createBanking = useCallback(() => {
    setLoading(true);
    let error = false;
    bankingService
      .createBanking({
        ...data,
        checkingAccountId: data?.originAccount,
        issueDate: moment(data?.issueDate).toISOString(),
        installment: 1,
        originFlag: "BANCARIO",
        competenceDate: moment(data?.competenceDate).format("MM/YYYY"),
      })
      .then((_res) => {
        createToast({
          status: "success",
          message: "Transação salva com sucesso",
        });
      })
      .catch((err) => {
        setLoading(false);
        error = true;
        const message = err?.response?.data?.errors[0].message;
        if (message) {
          createToast({
            status: "error",
            message: message,
          });
          return;
        }

        createToast({
          status: "error",
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

  const createTransaction = useCallback(async () => {
    setLoading(true);
    let error = false;

    try {
      await bankingService.createBanking({
        ...data,
        type: "DEBITO",
        accountPlanId: data?.originId,
        checkingAccountId: data?.originAccount,
        issueDate: moment(data?.issueDate).toISOString(),
        originFlag: "BANCARIO",
        competenceDate: moment(data?.competenceDate).format("MM/YYYY"),
        reconciled: "true",
      });

      await bankingService.createBanking({
        ...data,
        type: "CREDITO",
        accountPlanId: data?.destinyId,
        checkingAccountId: data?.destinyAccount,
        issueDate: moment(data.issueDate).toISOString(),
        originFlag: "BANCARIO",
        competenceDate: moment(data.competenceDate).format("MM/YYYY"),
        reconciled: "true",
      });

      setLoading(false);
      setData({});
      router.back();

      createToast({
        status: "success",
        message: "Transação salva com sucesso",
      });
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.errors[0]?.message || "Erro desconhecido";
      setLoading(false);

      createToast({
        status: "error",
        message: errorMessage,
      });
    }
  }, [data, router]);

  const formatTutors = () => {
    setFormatedTutors(
      tutors.map((tutor: any) => {
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

  const patientSuppliers = useQuery({
    queryKey: ["patient-suppliers"],
    queryFn: async () => {
      const response = await api({ url: "patient-suppliers", method: "get" });
      return response;
    },
  });

  const normalize = (text: string) => text?.toLowerCase().normalize("NFD");

  const [flags, setFlags] = useState([]);

  useEffect(() => {
    console.log(paymentMethods);
    setFlags(
      paymentMethods.find((method) => method?.id === data?.paymentMethodId)
        ?.flags
    );
  }, [data, paymentMethods]);

  const tfeAquires = useQuery({
    queryKey: ["tfeAquires"],
    queryFn: async () => {
      const response = await api({
        method: "get",
        url: `payment-methods/tef-acquirers`,
      });

      return response;
    },
  });

  return (
    <PageWrapper title="Movimentação bancária">
      <Container>
        <FormHandler disableEnterKeySubmitForm cleanFieldsOnSubmit={false}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              data?.type !== "transaction"
                ? createBanking()
                : createTransaction();
            }}
          >
            <div className="form-body uk-padding uk-margin-top">
              <div className="uk-flex">
                <div className="uk-margin-small-right uk-width-1-1">
                  <label>CPF/CNPJ ou nome do Titular</label>

                  {patientSuppliers?.data && (
                    <AutoComplete
                      options={
                        patientSuppliers?.data
                          ? [
                              ...patientSuppliers?.data?.map((item) => ({
                                ...item,
                                value: item?.name,
                              })),
                              ...formatedTutors,
                            ]
                          : formatedTutors
                      }
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
                        const normalize = (str) =>
                          str
                            ?.normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .toLowerCase();

                        const input = normalize(inputValue);
                        const name = normalize(option?.name || "");
                        const document = normalize(
                          option?.tutor?.document || option?.document || ""
                        );

                        return name.includes(input) || document.includes(input);
                      }}
                    />
                  )}
                </div>
                <div className="uk-margin-right">
                  <label>Data emissão</label>
                  <DatePicker
                    className="uk-width-1-1"
                    format="DD/MM/YYYY"
                    value={data?.issueDate ? moment(data.issueDate) : moment()}
                    onChange={(e) => setData({ ...data, issueDate: e })}
                  />
                </div>
                <div>
                  <label>Mês/Ano Competência</label>
                  <DatePicker
                    className="uk-width-1-1"
                    format="MM/YYYY"
                    picker="month"
                    value={
                      data?.competenceDate
                        ? moment(data?.competenceDate)
                        : data?.issueDate
                        ? moment(data.issueDate)
                        : moment()
                    }
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
                    onChange={(e) =>
                      setData({
                        reconciled: "true",
                        feeValue: 0,
                        feePercentage: 0,
                        discountValue: 0,
                        discountPercentage: 0,
                        type: e.target.value,
                      })
                    }
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
                    onChange={(e) =>
                      setData({ ...data, document: e.target.value })
                    }
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
                    onChange={(e) =>
                      setData({ ...data, historic: e.target.value })
                    }
                    value={data?.historic}
                  />
                </div>
                <div className="uk-margin-left uk-width-1-6">
                  <label>Nota Fiscal</label>
                  <Input
                    value={data?.fiscalNote}
                    onChange={(e) =>
                      setData({ ...data, fiscalNote: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="uk-flex uk-margin-top">
                <div className="uk-width-1-6 uk-margin-right">
                  <label>Taxa</label>
                  <Input
                    type="number"
                    value={data?.feeValue}
                    onChange={(e) =>
                      setData({ ...data, feeValue: e.target.value })
                    }
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
              <div
                className="uk-flex uk-flex-wrap uk-margin-top uk-width-1-1"
                style={{
                  gap: 10,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                }}
              >
                <div>
                  <label>Forma Pagamento</label>
                  <Select
                    className="uk-width-1-1"
                    value={data?.paymentMethodId}
                    showSearch
                    onChange={(e) => {
                      setData({ ...data, paymentMethodId: e });
                    }}
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                      const normalizedInput = normalize(input);
                      const normalizedOption = normalize(
                        option?.children?.toString() || ""
                      );
                      return normalizedOption.includes(normalizedInput);
                    }}
                  >
                    {paymentMethods.length > 0 &&
                      paymentMethods.map((method, i) => (
                        <Option key={"paymentMethods" + i} value={method.id}>
                          {method?.description}
                        </Option>
                      ))}
                  </Select>
                </div>

                <div>
                  <label>Bandeira Tef</label>
                  <SelectInfinityForge
                    name="tefFlagId"
                    onlyOneValue
                    options={flags?.map((flag: any) => ({
                      label: flag?.flag?.description,
                      value: flag?.flag?.id,
                    }))}
                    value={data?.tefFlagId}
                    onChangeInput={(value) => {
                      setData({ ...data, tefFlagId: value });
                    }}
                  />
                </div>

                <div>
                  <label>Adquirente Tef</label>
                  <SelectInfinityForge
                    name="tefAcquirerId"
                    onlyOneValue
                    isClearable
                    options={
                      tfeAquires?.data?.map((item) => ({
                        label: item?.description,
                        value: item.id,
                      })) || []
                    }
                  />
                </div>

                {data?.type === "transaction" && (
                  <>
                    <div>
                      <label>Plano Contas Origem</label>
                      <Select
                        showSearch
                        className="uk-width-1-1"
                        value={data?.accountPlanId}
                        onChange={(e) => setData({ ...data, originId: e })}
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                          const normalizedInput = normalize(input);
                          const normalizedOption = normalize(
                            option?.children?.toString() || ""
                          );
                          return normalizedOption.includes(normalizedInput);
                        }}
                      >
                        {plans?.length > 0 &&
                          plans?.map(
                            (plan, i) =>
                              plan.type === "DEBITO" && (
                                <Option
                                  key={"plans-debit-" + i}
                                  value={plan?.id}
                                >
                                  {plan?.description}
                                </Option>
                              )
                          )}
                      </Select>
                    </div>
                  </>
                )}

                {data?.type !== "transaction" && (
                  <div>
                    <label>Plano Contas</label>
                    <Select
                      showSearch
                      value={data?.accountPlanId}
                      className="uk-width-1-1"
                      placeholder="Selecione um plano"
                      onChange={(e) => setData({ ...data, accountPlanId: e })}
                      optionFilterProp="children"
                      filterOption={(input, option) => {
                        const normalizedInput = normalize(input);
                        const normalizedOption = normalize(
                          option?.children?.toString() || ""
                        );
                        return normalizedOption.includes(normalizedInput);
                      }}
                    >
                      {plans
                        ?.filter((plan) => plan.type === data.type)
                        ?.map((plan, i) => (
                          <Option key={`plans${i}`} value={plan.id}>
                            {plan.description}
                          </Option>
                        ))}
                    </Select>
                  </div>
                )}

                <div>
                  <label>
                    {data?.type === "transaction"
                      ? "Conta Corrente Origem"
                      : "Conta Corrente"}
                  </label>
                  <Select
                    showSearch
                    className="uk-width-1-1"
                    value={data?.originAccount}
                    onChange={(e) => setData({ ...data, originAccount: e })}
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                      const normalizedInput = normalize(input);
                      const normalizedOption = normalize(
                        option?.children?.toString() || ""
                      );
                      return normalizedOption.includes(normalizedInput);
                    }}
                  >
                    {checkingAccounts?.length > 0 &&
                      checkingAccounts?.map((account, i) => (
                        <Option
                          key={"checkingAccounts-select" + i}
                          value={account?.id}
                        >
                          {account?.description}
                        </Option>
                      ))}
                  </Select>
                </div>
              </div>

              {data?.type === "transaction" && (
                <div style={{ display: "grid", marginTop: 20, gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  <div className="">
                    <label>Plano Contas Destino</label>
                    <Select
                      showSearch
                      className="uk-width-1-1"
                      value={data?.accountPlanId}
                      onChange={(e) => setData({ ...data, destinyId: e })}
                      optionFilterProp="children"
                      filterOption={(input, option) => {
                        const normalizedInput = normalize(input);
                        const normalizedOption = normalize(
                          option?.children?.toString() || ""
                        );
                        return normalizedOption.includes(normalizedInput);
                      }}
                    >
                      {plans?.length > 0 &&
                        plans?.map(
                          (plan, i) =>
                            plan.type === "CREDITO" && (
                              <Option
                                key={"plans-credit-" + i}
                                value={plan?.id}
                              >
                                {plan?.description}
                              </Option>
                            )
                        )}
                    </Select>
                  </div>

                  <div>
                    <label>Conta corrente destino</label>
                    <Select
                      showSearch
                      className="uk-width-1-1"
                      value={data?.destinyAccount}
                      onChange={(e) => setData({ ...data, destinyAccount: e })}
                      optionFilterProp="children"
                      filterOption={(input, option) => {
                        const normalizedInput = normalize(input);
                        const normalizedOption = normalize(
                          option?.children?.toString() || ""
                        );
                        return normalizedOption.includes(normalizedInput);
                      }}
                    >
                      {checkingAccounts?.length > 0 &&
                        checkingAccounts?.map((account, i) => (
                          <Option
                            key={"checkingAccounts-" + i}
                            value={account?.id}
                          >
                            {account?.description}
                          </Option>
                        ))}
                    </Select>
                  </div>
                </div>
              )}
            </div>
            <footer
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <Button type="submit" text="Salvar" />

              <Button
                onClick={() => router.back()}
                text="Voltar"
                type="button"
              />
            </footer>
          </form>
        </FormHandler>
      </Container>
    </PageWrapper>
  );
});

export default Create;
