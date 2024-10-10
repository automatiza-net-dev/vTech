// @ts-nocheck
import { useState, useEffect, useCallback } from "react";

import { receiptService } from "@/OLD/services/receipt.service";

import { useRouter } from "next/router";
import { useMe } from "@/presentation/hooks";
import { usePlans } from "@/OLD/hooks/usePlans";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { usePaymentMethods } from "@/OLD/hooks/usePaymentMethods";

import AddPayments from "../AddPayments";
import { FormHandler } from "infinity-forge";
import { DatePicker } from "@mui/x-date-pickers";
import { Button } from "infinity-forge";
import {
  Collapse,
  Table,
  Input,
  Select,
  Tooltip,
  notification,
  Popconfirm,
} from "antd";
const { Panel } = Collapse;
const { Option } = Select;

import { EditTwoTone } from "@ant-design/icons";
import { IoIosCheckmark } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";

import moment from "moment";
import { sortItems } from "@/OLD/utils/sortItems";
import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";

function PaymentsPanel({
  payments,
  setReload,
  receipt,
  origin = false,
  setVisible,
  accountPlanId = false,
}) {
  const [data, setData] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editBlock, setEditBlock] = useState(false);
  const [selectedAccountPlanId, setSelectedAccountPlanId] = useState("");
  const [formattedPayments, setFormattedPayments] = useState([]);
  const [plansFilters, setPlansFilter] = useState({ type: "DEBITO" });

  const me = useMe();
  const { plans } = usePlans(plansFilters);
  const { paymentMethods } = usePaymentMethods();

  const router = useRouter();
  const finishReceiptPermission = useUserHasPermission("ENT07");
  const updatePaymentsPermission = useUserHasPermission("ENT05");
  const removePaymentsPermission = useUserHasPermission("ENT06");
  const generatesFinancesOnReceiptsFinish =
    me?.data?.unit?.unitConfig?.generates_finances_on_receipts_finish;

  sortItems(paymentMethods, "description");

  useEffect(() => {
    const arr = [];
    payments?.map((item) => {
      if (!arr.includes(item?.block) && item?.status !== "Excluido") {
        arr.push(item?.block);
      }
    });
    setBlocks(arr);
    setSelectedAccountPlanId(accountPlanId);
  }, [payments]);

  const formatPayments = () => {
    setFormattedPayments(
      payments
        ?.filter((payment) => payment?.status !== "Excluido")
        .map((payment, i) => {
          const paymentData = data?.find((item) => item?.id === payment?.id);

          return {
            flagDescription: paymentData?.flag,
            paymentMethodDescription: paymentData?.paymentMethod,
            block: paymentData?.block,
            date: (
              <DatePicker
                disabled={!(paymentData?.block === editBlock)}
                type="date"
                slotProps={{ textField: { variant: "standard" } }}
                value={paymentData?.expirationDate}
                onChange={(val) => {
                  let newArr = [...data];
                  newArr.splice(i, 1, {
                    ...data[i],
                    expirationDate: val,
                  });
                  setData(newArr);
                }}
              />
            ),
            originValue: paymentData?.installmentValue,
            value: (
              <Input
                value={paymentData?.installmentValue}
                disabled={!(paymentData?.block === editBlock)}
                onChange={(e) => {
                  let newArr = [...data];
                  newArr.splice(i, 1, {
                    ...data[i],
                    installmentValue: currencyFormatter(
                      convertIntlCurrency(e.target.value)
                    ),
                  });
                  setData(newArr);
                }}
              />
            ),
            paymentMethod: (
              <Select
                className="uk-width-1-1"
                value={paymentData?.paymentMethod?.id}
                disabled={!(paymentData?.block === editBlock)}
                onChange={(val) => {
                  let newArr = [...data];
                  newArr.splice(i, 1, {
                    ...data[i],
                    paymentMethod: val,
                    flags: paymentMethods?.find((item) => item?.id === val)
                      ?.flags,
                  });
                  setData(newArr);
                }}
              >
                {paymentMethods?.map((pm) => (
                  <Option value={pm?.id}>{pm?.description}</Option>
                ))}
              </Select>
            ),
            flag: (
              <Select
                disabled={!(paymentData?.block === editBlock)}
                value={paymentData?.tefFlagId}
                onChange={(val) => {
                  let newArr = [...data];
                  newArr.splice(i, 1, {
                    ...data[i],
                    tefFlagId: val,
                    tefAcquiredId: data?.flags?.find(
                      (item) => item?.flag?.id === val
                    )?.acquirer?.id,
                  });
                  setData(newArr);
                }}
              >
                {paymentData?.flags?.length > 0 &&
                  paymentData?.flags?.map((flag) => (
                    <Option value={flag?.flag?.id}>
                      {flag?.flag?.description}
                    </Option>
                  ))}
              </Select>
            ),
            flag: (
              <Select
                disabled={!(paymentData?.block === editBlock)}
                value={paymentData?.tefFlagId}
                onChange={(val) => {
                  let newArr = [...data];
                  newArr.splice(i, 1, {
                    ...paymentData,
                    tefFlagId: val,
                    tefAcquiredId: data?.flags?.find(
                      (item) => item?.flag?.id === val
                    )?.acquirer?.id,
                  });
                  setData(newArr);
                }}
              >
                {paymentData?.flags?.length > 0 &&
                  paymentData?.flags?.map((flag) => (
                    <Option value={flag?.flag?.id}>
                      {flag?.flag?.description}
                    </Option>
                  ))}
              </Select>
            ),
            nsu: (
              <Input
                value={paymentData?.nsuDocument}
                disabled={!(paymentData?.block === editBlock)}
                onChange={(e) => {
                  let newArr = [...data];
                  newArr.splice(i, 1, {
                    ...paymentData,
                    nsuDocument: e.target.value,
                  });
                  setData(newArr);
                }}
              />
            ),
          };
        })
    );
  };

  useEffect(() => {
    payments?.length > 0 && formatPayments();
  }, [payments, paymentMethods, editBlock, data]);

  useEffect(() => {
    setData(
      payments
        ?.filter((payment) => payment?.status !== "Excluido")
        .map((payment) => ({
          ...payment,
          expirationDate: moment(payment?.expiration_date),
          installmentValue: currencyFormatter(payment?.installment_value),
          paymentMethod: payment?.payment_method,
          nsuDocument: payment?.nsu_document,
          tefFlagId: payment?.flag?.id,
          paymentMethod: payment?.paymentMethod,
          flags: payment?.paymentMethod
            ? paymentMethods?.find(
                (pm) => pm?.id === payment?.paymentMethod?.id
              )?.flags
            : [],
          edit: false,
        }))
    );
  }, [payments, paymentMethods]);

  const paymentsColumns = [
    { title: "Data", key: "date", dataIndex: "date" },
    { title: "Valor", key: "value", dataIndex: "value" },
    {
      title: "Forma pagamento",
      key: "paymentMethod",
      dataIndex: "paymentMethod",
    },
    {
      title: "Comprovante/Nsu",
      key: "nsu",
      dataIndex: "nsu",
    },
    {
      title: "Bandeira",
      key: "flag",
      dataIndex: "flag",
    },
  ];

  const submitPaymentUpdate = useCallback(() => {
    receiptService
      .updateReceiptPayment({
        items: data?.map((item) => ({
          receiptPaymentId: item?.id,
          paymentMethodId: item?.paymentMethod?.id || item?.paymentMethod,
          installmentValue: convertIntlCurrency(item?.installmentValue),
          expirationDate: moment(item?.expirationDate).toISOString(),
          nsuDocument: item?.nsuDocument,
          tefFlagId: item?.tefFlagId,
          tefAcquirerId: item?.tefAcquiredId,
        })),
      })
      .then((_res) => {
        setReload((prv) => !prv);
        setEditBlock(false);
        return notification.success({
          message: "Informações do pagamento atualizadas com sucesso!",
        });
      })
      .catch((err) => {
        if (err?.response?.data?.message) {
          return notification.error({
            message: err?.response?.data?.message?.split(":")[1],
          });
        }
      });
  }, [data]);

  const removePaymentBlock = (data) => {
    setLoading(true);

    receiptService
      .removePaymentBlock(data)
      .then((_res) => {
        setReload((prv) => !prv);
        setLoading(false);
        return notification.success({ message: "Bloco removido com sucesso!" });
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao remover o bloco de pagamento",
        });
      });
  };

  const submitFinishReceipt = useCallback(() => {
    setLoading(true);

    receiptService
      ?.finishReceipt({ receiptId: receipt?.id })
      .then((res) => {
        setReload((prv) => !prv);
        setVisible(false);
        return notification.success({
          message: "Nota de entrada finalizada com sucesso",
        });
      })
      .catch((err) => {
        if (err?.response?.data?.code === "E_NO_VARIATION") {
          return notification.error({
            message:
              "Existem produtos da nota que ainda não foram relacionados",
          });
        } else {
          return notification.error({
            message: err?.response?.data?.message?.split(":")[1],
          });
        }
        return notification.error({
          message: "Houve um erro ao finalizar a nota de entrada...",
        });
      });
  }, [receipt?.id]);

  return (
    <>
      {plans.length > 0 &&
        !generatesFinancesOnReceiptsFinish &&
        accountPlanId !== null && (
          <FormHandler initialData={{ accountPlanId: selectedAccountPlanId }}>
            <section style={{ display: "flex", justifyContent: "right" }}>
              <div>
                <label>Plano de contas para geração dos tributos</label>

                <Select
                  onChangeInput={(val) => setSelectedAccountPlanId(val)}
                  onlyOneValue
                  style={{ width: "100%" }}
                  isMultiple={false}
                  menuPlacement="bottom"
                  name="accountPlanId"
                  placeholder="Selecionar"
                  options={[
                    ...plans.map((plan) => ({
                      value: plan.id,
                      label: plan.description,
                    })),
                  ]}
                />
              </div>
            </section>
          </FormHandler>
        )}
      {!origin && (
        <AddPayments
          receipt={receipt}
          setReload={setReload}
          accountPlanId={selectedAccountPlanId}
        />
      )}

      {payments?.filter((payment) => payment?.status !== "Excluido")?.length >
        0 &&
        blocks?.map((i) => {
          const paymentsList = formattedPayments?.filter(
            (item) => item?.block === i
          );
          return (
            <Collapse className="uk-margin-small-top">
              <Panel
                header={
                  <div>
                    {paymentsList?.[0]?.paymentMethodDescription?.type ===
                      "DEBITO" ||
                    paymentsList?.[0]?.paymentMethodDescription?.type ===
                      "CREDITO"
                      ? `
                      ${
                        paymentsList?.[0]?.paymentMethodDescription?.tef !== "NAO"
                          ? paymentsList?.[0]?.paymentMethodDescription?.tef
                          : ""
                      }\n
                      CARTÃO ${
                        paymentsList?.[0]?.paymentMethodDescription?.type
                      } - ${paymentsList?.[0]?.flagDescription?.description}
                      `
                      : paymentsList?.[0]?.paymentMethodDescription
                          ?.description}{" "}
                    {currencyFormatter(
                      paymentsList?.reduce(
                        (acc, current) =>
                          acc + convertIntlCurrency(current?.originValue),
                        0
                      )
                    )}{" "}
                    {paymentsList?.length}x
                  </div>
                }
              >
                <div className=" uk-flex uk-flex-right">
                  <Popconfirm
                    title="Deseja remover este bloco?"
                    onConfirm={() =>
                      removePaymentBlock({
                        receiptId: receipt?.id,
                        block: i,
                      })
                    }
                  >
                    {paymentsList?.[0]?.block !== editBlock && (
                      <>
                        {removePaymentsPermission && (
                          <Button
                            classCallback="uk-margin-small-right"
                            text="Remover bloco"
                          />
                        )}
                      </>
                    )}
                  </Popconfirm>
                  {paymentsList?.[0]?.block !== editBlock ? (
                    <>
                      {updatePaymentsPermission && (
                        <Button
                          text="Alterar dados"
                          onClick={() => setEditBlock(paymentsList?.[0]?.block)}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => submitPaymentUpdate()}
                        text="Salvar"
                      />

                      <Button
                        text="Cancelar"
                        onClick={() => {
                          setReload((prv) => !prv);
                          setEditBlock(false);
                        }}
                      />
                    </>
                  )}
                </div>
                <Table columns={paymentsColumns} dataSource={paymentsList} />
              </Panel>
            </Collapse>
          );
        })}
      <div className="uk-margin-small-top uk-flex uk-flex-right">
        <Button
          text="Voltar"
          onClick={() => (setVisible ? setVisible(false) : router.back())}
        />

        {finishReceiptPermission && (
          <Button
            classCallback=""
            onClick={() => submitFinishReceipt()}
            text="Finalizar nota"
          />
        )}
      </div>
    </>
  );
}

export default PaymentsPanel;
