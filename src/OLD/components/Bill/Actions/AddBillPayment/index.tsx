import React, { useState, useEffect, useCallback, useMemo } from "react";
import Masks from "@/OLD/utils/masks";
import { RemoteBills } from "@/data";
import { container, TypesAutomatiza } from "@/container";
import { billService } from "@/OLD/services/bills.service";
import { useShowBill } from "@/OLD/hooks/useBills";
import { usePaymentMethods } from "@/OLD/hooks/usePaymentMethods";
import { useDailyCasher, useDailyCashier } from "@/OLD/hooks/useDailyCashiers";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import {
  useLoadAllPatientTutor,
  useSearchDailyMovements,
} from "@/presentation";
import moment from "moment";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import CardPanel from "./CardPanel";
import { Container } from "./styles";
import NonTefPanel from "./NonTefPanel";
import ResumePanel from "./ResumePanel";
import { DetailsPanel } from "./DetailsPanel";
import { PaymentsPreviewComponent } from "@/presentation";
import ProductsPanel from "../Details/ProductsPanel";
import DailyCashierFormChild from "../../../DailyCashier/Actions/FormChild";
import { Modal as AntdModal, Checkbox, Divider, Table } from "antd";
import {
  Select,
  FormHandler,
  useToast,
  api,
  useQueryClient,
  useQuery,
  useMutation,
  Button,
  Modal,
  useTable,
  useAuthAdmin,
} from "infinity-forge";
import { AxiosError } from "axios";
import { currencyFormatter } from "@/OLD/components/Budget";
import { dailyCasherService } from "@/OLD/services/dailyCasher.service";
import { useTutorCredits } from "../../../../hooks/useListCredits";

function AddBillPayment({
  billId,
  setVisible,
  setReloadBill,
  chunkOfPayments = [],
  creditOverflow = false,
  literalTotal = null,
  virtualTotal = null,
}: any) {
  const [selectedRows, setSelectedRows] = React.useState<React.Key[]>([]);
  const handleToggleSelected = (recordId: React.Key) => {
    setSelectedRows((old) => (old.includes(recordId) ? [] : [recordId]));
  };

  const isUsingChunking = chunkOfPayments.length > 0;
  const chunkingTotal = chunkOfPayments.reduce(
    (acc, current) => acc + current.missing_value,
    0,
  );
  const creditsQuery = useTutorCredits(
    chunkOfPayments.find((p) => p.clientID)?.clientID
    ?? chunkOfPayments.find((p) => p.patientID)?.patientID
    ?? '',
    isUsingChunking,
  );

  const relativeTotal = useMemo(() => {
    if (selectedRows.length === 0) {
      return virtualTotal;
    }

    const credit = creditsQuery.data?.find((c) => c.id === selectedRows.at(0));
    if (!credit) {
      return virtualTotal;
    }

    const offset = credit.originalValue - credit.usedValue;

    return Math.max(0, virtualTotal - offset);
  }, [selectedRows, creditsQuery.data, virtualTotal]);

  const bypassInstallments = useMemo(() => {
    if (selectedRows.length === 0 || !creditsQuery.data) {
      return false;
    }

    const item = creditsQuery.data?.find((d) => d.id === selectedRows.at(0));
    if (!item) {
      return false;
    }

    const missingValue = item.originalValue - item.usedValue;

    return missingValue > virtualTotal;
  }, [selectedRows, creditsQuery.data, virtualTotal]);

  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters] = useState<any>({ active: true });
  const [cashierFilters] = useState<any>({
    from: moment(new Date()).startOf("day"),
    to: moment(new Date()).endOf("day"),
    status: "ABERTO",
  });

  const [debitMethods, setDebitMethods] = useState<any>([]);
  const [creditMethods, setCreditMethods] = useState<any>([]);
  const [nonTefMethods, setNonTefMethods] = useState<any>([]);
  const [higherBlock, setHigherBlock] = useState(0);
  const [blockArr, setBlockArr] = useState<any>([]);
  const [formData, setFormData] = useState<any>({
    expirationDate: moment(),
  });
  const [allowEditFinancialRsp, setAllowEditFinancialRsp] = useState(false);
  const [financialResponsible, setFinancialResponsible] = useState<any>({});

  const queryClient = useQueryClient();
  const endBillPermission = useUserHasPermission("VEN06");

  const { createToast } = useToast();

  const { data } = useShowBill(billId, !isUsingChunking);
  const users = useLoadAllPatientTutor({});
  const { paymentMethods } = usePaymentMethods(filters);
  const { cashiers, fetchDailyCashiers } = useDailyCasher(
    false,
    cashierFilters,
  );

  const [hideCashierModal, setHideCashierModal] = useState(false);
  const cashierStatusQuery = useQuery({
    queryKey: ["check-cashier-status"],
    queryFn: async () => {
      const response = await api({
        url: "daily-cashiers/check-cashier-status",
        method: "get",
        // body: {
        //   active: true,
        // },
      });

      fetchDailyCashiers();

      return response as {
        id: string | null;
        hasRows: boolean;
        hasPermission: boolean;
        status: "Hoje" | "Anterior" | null;
      };
    },
  });

  const filterMethods = () => {
    setDebitMethods(
      paymentMethods?.filter(
        (method) => method?.tef !== "NAO" && method?.type === "DEBITO",
      ),
    );

    setCreditMethods(
      paymentMethods?.filter(
        (method) => method?.tef !== "NAO" && method?.type === "CREDITO",
      ),
    );

    setNonTefMethods(paymentMethods?.filter((method) => method?.tef === "NAO"));
  };

  const closePayment = useCallback(() => {
    let error = false;
    billService
      .closeBillPayment(data?.id)
      .then((_res) => {
        createToast({
          status: "success",
          message: "Venda finalizada com sucesso!",
        });
      })
      .catch((err) => {
        error = true;
        createToast({
          status: "error",
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
      createToast({ status: "error", message: "Há valores pendentes" });
      return;
    }
    queryClient.refetch(["bills", true], { mode: "include" });

    setReloadBill?.((s) => !s);
    queryClient.invalidateQueries(["paymentsPreview"]);

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

  const submitPayment = useCallback(
    async (params) => {
      setLoading(true);

      if (cashiers.length === 0) {
        return createToast({
          status: "error",
          message: "Nenhum caixa diário aberto",
        });
      }

      if (
        !bypassInstallments &&
        paymentMethods.find(
          (method) => method?.id === formData?.paymentMethodId,
        ) !== "NÃO" &&
        !formData?.installments
      ) {
        return createToast({
          status: "error",
          message: "Selecione a quantidade de parcelas",
        });
      }

      const payload = {
        ...formData,
        maxParcelas: params?.maxParcelas || formData?.maxParcelas,
        installmentsValue: convertIntlCurrency(formData?.installmentsValue),
      };

      if (isUsingChunking) {
        Object.assign(payload, {
          installmentsValue: virtualTotal,
          clientCreditId: selectedRows.at(0) as string,
          chunkOfBills: chunkOfPayments.map((i) => i.id),
          creditOverflow,
        });
      } else {
        Object.assign(payload, {
          billId,
        });
      }

      try {
        await api({
          url: "bills/create-payment",
          method: "post",
          body: payload,
        });

        queryClient.refetch(["sales-metadata-add-credits"], {
          mode: "include",
        });
        queryClient.refetch(["bills", true], { mode: "include" });
        setReloadBill?.((s) => !s);
        queryClient.invalidateQueries(["paymentsPreview"]);
        setFormData({
          expirationDate: moment(),
        });
        setVisible(false);

        return createToast({
          status: "success",
          message: "Pagamento adicionado com sucesso!",
        });
      } catch (err: any) {
        if (err instanceof AxiosError) {
          if (
            window.confirm(err?.response?.data?.message) &&
            !params?.maxParcelas
          ) {
            submitPayment({ maxParcelas: true });
            setFormData({
              expirationDate: moment(),
            });
          }

          return;
        }

        if (
          err.response.data.message.includes(
            "Não foi possível encontrar o caixa aberto para o usuário",
          )
        ) {
          return createToast({
            status: "error",
            message: "Não existe caixa diário aberto para o seu Login",
          });
        }

        if (err.response.data.message?.includes("E_NOT_OPEN")) {
          return createToast({
            status: "error",
            message: "Não existe caixa diário aberto",
          });
        }

        setReloadBill?.((s) => !s);
        queryClient.refetch(["bills", true], { mode: "include" });
      } finally {
      }
    },
    [
      formData,
      cashiers,
      billId,
      virtualTotal,
      isUsingChunking,
      chunkOfPayments,
      selectedRows,
    ],
  );

  const shouldShowModal = useMemo(() => {
    if (!cashierStatusQuery.data || hideCashierModal) {
      return false;
    }

    if (cashierStatusQuery.data.hasRows) {
      return cashierStatusQuery.data.status !== "Hoje";
    }

    // Se não tem nenhum caixa "válido", apenas mostrar mesmo
    // o conteúdo vai variar apenas
    return true;
  }, [cashierStatusQuery?.data, hideCashierModal]);

  const calculateSelected = useCallback(
    (recordId: number) => {
      if (!selectedRows.includes(recordId)) {
        return "-";
      }

      const item = creditsQuery.data?.find((d) => d.id === recordId);
      if (!item) {
        return "-";
      }

      // virtual -> valor input
      // missing -> credito "sobrante" 
      const missingValue = item.originalValue - item.usedValue;

      if (virtualTotal > missingValue) {
        return currencyFormatter(missingValue);
      }

      return currencyFormatter(virtualTotal);
    },
    [selectedRows, creditsQuery.data, virtualTotal],
  );

  return (
    <Container>
      {!!cashierStatusQuery.data && (
        <Modal
          title={"Fechamento de Caixa"}
          open={shouldShowModal}
          onClose={() => setHideCashierModal(true)}
          styles={{ width: "500px", padding: "20px" }}
          children={
            <DailyCashierSync
              {...cashierStatusQuery.data}
              shouldHide={() => setHideCashierModal(true)}
            />
          }
        />
      )}

      {isUsingChunking && (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p>
              Pagamento das vendas:{" "}
              {chunkOfPayments.map((p) => p.tag).join(", ")}
            </p>
            <p>
              Data:{" "}
              {moment(chunkOfPayments.at(0).date).format("DD/MM/YYYY - HH:mm")}
            </p>
            <p>Cliente: {chunkOfPayments.at(0).client}</p>

            {creditsQuery.data?.length > 0 && (
              <Table
                style={{ width: "900px" }}
                columns={[
                  {
                    title: "",
                    key: "controls",
                    width: 20,
                    render: (_, record) => creditOverflow ? <p>N/A</p> : (
                      <Checkbox
                        checked={selectedRows.includes(record.id)}
                        onChange={() => handleToggleSelected(record.id)}
                        disabled={creditOverflow}
                      />
                    ),
                  },
                  {
                    title: "Data",
                    dataIndex: "date",
                    key: "date",
                  },
                  {
                    title: "Valor Original",
                    dataIndex: "originalValue",
                    key: "originalValue",
                  },
                  {
                    title: "Valor Usado",
                    dataIndex: "usedValue",
                    key: "usedValue",
                  },
                  {
                    title: "Valor Disponível",
                    dataIndex: "missingValue",
                    key: "missingValue",
                  },
                  {
                    title: "Valor a ser usado",
                    dataIndex: "selectedValue",
                    key: "selectedValue",
                  },
                ]}
                dataSource={creditsQuery.data?.map((item) => ({
                  id: item.id,
                  date: moment(item.created_at).format("DD/MM/YYYY - HH:mm"),
                  originalValue: currencyFormatter(item.originalValue),
                  usedValue: currencyFormatter(item.usedValue),
                  missingValue: currencyFormatter(
                    item.originalValue - item.usedValue,
                  ),
                  selectedValue: calculateSelected(item.id),
                }))}
                pagination={false}
              />
            )}
          </div>
        </>
      )}

      <div className="uk-margin-top">
        {!isUsingChunking && (
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
        )}
        <hr />
        <section className="payment-detail-container uk-padding uk-shadow-small">
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
              locked={isUsingChunking}
              fakeTotal={
                isUsingChunking ? currencyFormatter(relativeTotal) : null
              }
              bill={data}
              formData={formData}
              setFormData={setFormData}
              loading={loading}
              setLoading={setLoading}
              submit={submitPayment}
            />
            <ResumePanel
              bill={data}
              formData={formData}
              fakeTotal={isUsingChunking ? chunkingTotal : null}
              fakePayment={isUsingChunking ? virtualTotal : null}
            />
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
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Button onClick={() => setVisible(false)} text="Salvar" />

            {endBillPermission && (
              <Button onClick={() => verifyPayment()} text="Finalizar" />
            )}
          </div>
        </footer>
      </div>
    </Container>
  );
}

function DailyCashierSync(props: {
  id?: string | null;
  hasRows: boolean;
  hasPermission: boolean;
  status: string | null;
  shouldHide: () => void;
}) {
  const queryClient = useQueryClient();
  const { user } = useAuthAdmin();
  const [cashierModalState, setCashierModalState] = useState<
    "hidden" | "closingOld" | "openingNew"
  >("hidden");
  const dailyMovementsQuery = useSearchDailyMovements({
    status: "Aberto",
  });

  const [openData, setOpenData] = useState({
    cashierTotal: currencyFormatter(0),
  });
  const [closeData, setCloseData] = useState({
    cashierTotal: currencyFormatter(0),
    observations: "",
  });

  const openDailyCashierMutation = useMutation({
    queryKey: ["open-daily-cashier"],
    queryFn: async () => {
      await dailyCasherService.openDailyCasher({
        dailyMovementId: dailyMovementsQuery.data?.[0]?.id,
        initialBalance: Masks.noMoney(openData?.cashierTotal),
        userId: user?.id,
        openingDate: moment(new Date()).toISOString(),
      });

      queryClient.invalidateQueries({
        queryKey: ["check-cashier-status"],
      });
    },
  });

  const closeCashierMutation = useMutation({
    queryKey: ["close-daily-cashier"],
    queryFn: async () => {
      await dailyCasherService.closeDailyCasher(props?.id ?? "", {
        observations: closeData?.observations,
        cashierTotal: Masks.noMoney(closeData?.cashierTotal),
        userId: user?.id,
        closingDate: moment(new Date()).toISOString(),
      });

      setCashierModalState("openingNew");
    },
  });

  if (props.hasRows) {
    if (props.hasPermission) {
      return (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h3>
              Existe um caixa diário de dias anteriores aberto. Deseja fechá-lo
              e abrir um novo Caixa Diário?
            </h3>
            <div style={{ display: "flex", gap: 10, paddingTop: 16 }}>
              <Button
                text="Sim"
                onClick={() => setCashierModalState("closingOld")}
              />
              <Button text="Não" onClick={() => props.shouldHide()} />
            </div>
          </div>

          <AntdModal
            open={cashierModalState === "closingOld"}
            title={"Fechamento de Caixa"}
            onOk={() => closeCashierMutation.mutate()}
            onCancel={() => setCashierModalState("hidden")}
            zIndex={1600}
            centered
            confirmLoading={closeCashierMutation.isLoading}
          >
            <DailyCashierFormChild
              data={closeData}
              setData={setCloseData}
              numberInput={true}
            />
          </AntdModal>

          <AntdModal
            open={cashierModalState === "openingNew"}
            title={"Abertura de Caixa"}
            onOk={() => openDailyCashierMutation.mutate()}
            onCancel={() => setCashierModalState("hidden")}
            zIndex={1600}
            centered
            confirmLoading={openDailyCashierMutation.isLoading}
          >
            <DailyCashierFormChild
              data={openData}
              setData={setOpenData}
              numberInput={true}
              showObservations={false}
            />
          </AntdModal>
        </>
      );
    }

    return (
      <h3>
        Existe um caixa diário de dias anteriores aberto. É necessário fechar
        este caixa e abrir um novo antes de lançar os pagamentos da venda.
      </h3>
    );
  }

  if (props.hasPermission) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3>
          Não existe caixa diário aberto para a data de hoje. Deseja abrir um
          Caixa Diário?
        </h3>
        <div style={{ display: "flex", gap: 10, paddingTop: 16 }}>
          <Button
            text="Sim"
            onClick={() => setCashierModalState("openingNew")}
          />
          <Button text="Não" onClick={() => props.shouldHide()} />
        </div>

        <AntdModal
          open={cashierModalState === "openingNew"}
          title={"Abertura de Caixa"}
          onOk={() => openDailyCashierMutation.mutate()}
          onCancel={() => setCashierModalState("hidden")}
          zIndex={1600}
          centered
          confirmLoading={openDailyCashierMutation.isLoading}
        >
          <DailyCashierFormChild
            data={openData}
            setData={setOpenData}
            numberInput={true}
            showObservations={false}
          />
        </AntdModal>
      </div>
    );
  }

  return (
    <>
      <h3>
        Não existe Caixa Diario Aberto. É necessário um caixa para lançamento
        dos pagamentos da venda.
      </h3>
    </>
  );
}

export default AddBillPayment;
