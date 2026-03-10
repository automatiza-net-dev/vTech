// @ts-nocheck
import * as React from "react";
import { PrintHeader } from "@/presentation";
import {
  Input as AntInput,
  Checkbox,
  DatePicker,
  Divider,
  InputNumber,
  Modal,
  Select,
  Table,
  Radio,
  Tabs,
  Popconfirm,
} from "antd";
import { IoMdTrash } from "react-icons/io";
import { BsEye } from "react-icons/bs";
import {
  api,
  Button, useQueryClient, useToast
} from "infinity-forge";
import { Container } from "../styles";
import {
  budgetStatusFormatter,
  currencyFormatter,
} from "@/OLD/components/Budget";
import { CgChevronDown, CgChevronUp } from "react-icons/cg";
import { useDictionary, useMutation, useQuery } from "@/presentation";
import { petsService } from "@/OLD/services/patient.service";
import { billService } from "@/OLD/services/bills.service";
import { financesService } from "@/OLD/services/finances.service";
import moment from "moment";
import { billStatusFormatter } from "../utils/status-formater";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import AddBillPayment from "../Actions/AddBillPayment";
import { AxiosError } from "axios";
import TutorAggregatedCredits from "../tutor-aggregated-credits";
import { useReactToPrint } from "react-to-print";
import { styled } from "styled-components";

type ClientPaymentData = {
  id: number
  value: number
  payment_date: string
  paymentMethod: {
    id: string
    description: string
  }
  client: {
    id: string
    name: string
    tutor: {
      id: string
      document: string
      patient_id: string
      fullAddress: string
    }
  }
  billPayments: Array<{
    id: string
    total_value: number
    expiration_date: string
    printed_at: string | null
    paymentMethod: {
      id: string
      description: string
    }
    printUser: {
      id: string
      name: string
    } | null
    bill: {
      id: string
      tag: string
      bill_date: string
      businessUnit: {
        id: string
        company_name: string
        document: string
        phone: string
        postal_code: string
        address: string
        number: string
        complement: string
        district: string
        city: string
        state: string
      }
      client: {
        id: string
        name: string
      }
      additionalInformation: any
    }
    finances: Array<{
      id: string
      payment_date: string | null
      expiration_date: string | null
      total_value: number
      original_value: number
      value: number
      payment_value: number
      paymentMethod: {
        id: string
        description: string
      }
    }>
  }>
}

export default function AddBillPaymentWithCredits(props: {
  isOpen: boolean;
  toggle: () => void;
  params: { tutor: string; patient?: string };
  onDelete?: () => void
}) {
  const [expandedRowKeys, setExpandedRowKeys] = React.useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<React.Key[]>([]);
  const [selectedPayment, setSelectedPayment] = React.useState<number | null>(null);
  const [visiblePayments, setVisiblePayments] = React.useState(false);
  const [editingInstallments, setEditingInstallments] = React.useState<number | null>(null);
  const [installmentDates, setInstallmentDates] = React.useState<Array<{ id: string, expirationDate: moment.Moment }>>([]);
  const [savingInstallments, setSavingInstallments] = React.useState(false);
  const { getWord } = useDictionary();
  const [tabState, setTabState] = React.useState("vendas");
  const [selectedPaymentToPrint, setSelectedPaymentToPrint] = React.useState<number | null>(null);
  const { createToast } = useToast();
  const queryClient = useQueryClient()

  const componentRef = React.useRef(null);
  const imprimir2 = useReactToPrint({ contentRef: componentRef });

  const selectedPaymentPrintDataQuery = useQuery({
    enabled: typeof selectedPaymentToPrint === 'number' && selectedPaymentToPrint > 0,
    queryKey: ["client-payment-to-print", selectedPaymentToPrint],
    queryFn: async () => {
      const data = await api({
        method: 'get',
        url: `bills/print-client-payment-receipts/${selectedPaymentToPrint ?? 0}`
      })

      return data as ClientPaymentData
    },
  });

  React.useEffect(() => {
    if (selectedPaymentPrintDataQuery.data && !selectedPaymentPrintDataQuery.isLoading) {
      imprimir2()
      setSelectedPaymentToPrint(null)
    }
  }, [selectedPaymentPrintDataQuery.data, selectedPaymentPrintDataQuery.isLoading])

  const salesQuery = useQuery({
    enabled: props.isOpen,
    queryKey: ["sales-metadata-add-credits", props.params],
    queryFn: async () => {
      const result = await petsService.getPatientSalesMetadata(
        props.params.patient ?? props.params.tutor,
        props.params.tutor,
        {
          onlyOpen: 1,
        },
      );

      return result.data;
    },
  });


  const paymentMetadataQuery = useQuery({
    enabled: props.isOpen && !!selectedPayment,
    queryKey: ["payment-metadata", selectedPayment],
    queryFn: async () => {
      if (!selectedPayment) {
        return
      }

      const data = await billService.getClientPaymentSales(selectedPayment)

      return data as {
        credits: {
          billId: string
          tag: string
          paidValue: number
          totalValue: string
        }[]
        sales: {
          id: number,
          originalValue: number,
          usedValue: number,
          returned: boolean,
        }[]
      }
    },
  });


  const tutorPaymentsQuery = useQuery({
    enabled: props.isOpen,
    queryKey: ["tutor-payments", props.params],
    queryFn: async () => {
      const result = await petsService.getTutorPayments(
        props.params.patient,
        props.params.tutor,
      );

      return result.data;
    },
  });
  const totalPaymentValue = tutorPaymentsQuery.data
    ? tutorPaymentsQuery.data.reduce((acc, curr) => acc + curr.value, 0)
    : 0;

  const deleteClientPayments = useMutation({
    queryKey: ["delete-tutor-payments", props.params],
    queryFn: async (id: number) => {
      try {
        await billService.removeClientPayment(id);
      } catch (e) {
        if (e instanceof AxiosError) {
          createToast({
            message:
              e.response.data?.message ?? "Erro na hora de remover o pagamento",
            status: "error",
          });
        }
      } finally {
        salesQuery.refetch();
        tutorPaymentsQuery.refetch();
        queryClient.refetch(['RemotePatient', props.params.patient])
        queryClient.refetch(['Bills'])
        queryClient.refetch(['tutor-aggregated-credits', props.params.tutor])
        props?.onDelete?.()
      }
    },
  });

  React.useEffect(() => {
    if (!editingInstallments || !tutorPaymentsQuery.data) {
      setInstallmentDates([]);
      return;
    }

    const payment = tutorPaymentsQuery.data.find((p: any) => p.id === editingInstallments);
    if (payment && payment.finances) {
      setInstallmentDates(
        payment.finances.map((finance: any) => ({
          id: finance.id,
          expirationDate: moment(finance.expiration_date),
        }))
      );
    }
  }, [editingInstallments, tutorPaymentsQuery.data]);

  React.useEffect(() => {
    if (!salesQuery.data) {
      return;
    }

    setSelectedRows(salesQuery.data.map((d) => d.id));
  }, [salesQuery.data]);

  const [overflowType, setOverflowType] = React.useState<
    null | "vale" | "troco"
  >(null);

  const selectedData = salesQuery.data
    ? salesQuery.data.filter((d) => selectedRows.includes(d.id))
    : [];

  const literalTotal = selectedData.reduce(
    (acc, current) => acc + Number.parseFloat(current.missing_value),
    0,
  );
  const selectedClients = selectedData.reduce(
    (acc, curr) => {
      if (!acc.find((d) => d.id === curr.clientID)) {
        acc.push({ id: curr.clientID, name: curr.client });
      }
      return acc;
    },
    [] as { id: string; name: string }[],
  );

  const [virtualTotal, setVirtualTotal] = React.useState(0);
  React.useEffect(() => {
    setVirtualTotal(
      selectedRows.reduce(
        (acc, current) =>
          acc +
          Number.parseFloat(
            salesQuery.data?.find((d) => d.id === current)?.missing_value ??
            "0",
          ),
        0,
      ),
    );
  }, [selectedRows, salesQuery.data]);

  const handleToggleExpand = (_expanded: boolean, recordId: React.Key) => {
    setExpandedRowKeys((prev) => {
      const exists = prev.includes(recordId);
      if (exists) {
        return prev.filter((id) => id !== recordId);
      } else {
        return [...prev, recordId];
      }
    });
  };

  const handleToggleSelected = (recordId: React.Key) => {
    setSelectedRows((prev) => {
      const exists = prev.includes(recordId);
      if (exists) {
        return prev.filter((id) => id !== recordId);
      } else {
        return [...prev, recordId];
      }
    });
  };

  const handleSaveInstallmentDates = async () => {
    const payment = tutorPaymentsQuery.data?.find((p: any) => p.id === editingInstallments);
    if (!payment?.paymentMethod?.allow_change_expiration_date) {
      createToast({
        status: "error",
        message: "Este método de pagamento não permite alterar datas de vencimento",
      });
      return;
    }

    setSavingInstallments(true);
    try {
      await financesService.updateExpirationDates({
        items: installmentDates.map((item) => ({
          id: item.id,
          expirationDate: item.expirationDate.format("YYYY-MM-DD"),
        })),
      });
      createToast({
        status: "success",
        message: "Datas de vencimento atualizadas com sucesso!",
      });
      setEditingInstallments(null);
      tutorPaymentsQuery.refetch();
    } catch (error) {
      createToast({
        status: "error",
        message: "Erro ao atualizar datas de vencimento",
      });
    } finally {
      setSavingInstallments(false);
    }
  };

  return (
    <>
      <section style={{ display: "none" }}>
        <div ref={componentRef as any}>
          <PrintPaymentReceipts
            clientPayment={selectedPaymentPrintDataQuery.data}
          />
        </div>
      </section>

      <Modal
        title=""
        open={visiblePayments}
        onOk={() => setVisiblePayments(false)}
        onCancel={() => setVisiblePayments(false)}
        width={1200}
        footer={null}
      >
        <AddBillPayment
          setVisible={setVisiblePayments}
          chunkOfPayments={selectedData}
          creditOverflow={
            virtualTotal > literalTotal && overflowType === "vale"
          }
          literalTotal={literalTotal}
          virtualTotal={virtualTotal}
        />
      </Modal>

      <Modal
        title="Alterar Vencimento das Parcelas"
        open={!!editingInstallments}
        onOk={handleSaveInstallmentDates}
        onCancel={() => setEditingInstallments(null)}
        width={800}
        confirmLoading={savingInstallments}
        okText="Salvar"
        cancelText="Cancelar"
        okButtonProps={{
          disabled: !tutorPaymentsQuery.data?.find((p: any) => p.id === editingInstallments)?.paymentMethod?.allow_change_expiration_date
        }}
      >
        <div style={{ marginTop: 20 }}>
          <Table
            columns={[
              {
                title: "Parcela",
                dataIndex: "installment",
                key: "installment",
                width: 100,
              },
              {
                title: "Valor",
                dataIndex: "value",
                key: "value",
                render: (val) => currencyFormatter(val),
              },
              {
                title: "Data de Vencimento",
                dataIndex: "expirationDate",
                key: "expirationDate",
                render: (_, record, index) => {
                  const payment = tutorPaymentsQuery.data?.find((p: any) => p.id === editingInstallments);
                  const canEdit = payment?.paymentMethod?.allow_change_expiration_date ?? false;
                  return (
                    <DatePicker
                      format="DD/MM/YYYY"
                      value={installmentDates[index]?.expirationDate}
                      onChange={(date) => {
                        const newDates = [...installmentDates];
                        newDates[index] = {
                          ...newDates[index],
                          expirationDate: date,
                        };
                        setInstallmentDates(newDates);
                      }}
                      style={{ width: "100%" }}
                      disabled={!canEdit}
                    />
                  );
                },
              },
            ]}
            dataSource={tutorPaymentsQuery.data
              ?.find((p: any) => p.id === editingInstallments)
              ?.finances?.map((finance: any, index: number) => ({
                key: finance.id,
                id: finance.id,
                installment: finance.installment || index + 1,
                value: finance.value,
                expirationDate: finance.expiration_date,
              })) || []}
            loading={tutorPaymentsQuery.isLoading}
            pagination={false}
            rowKey="id"
          />
        </div>
      </Modal>

      <Modal
        title=""
        open={props.isOpen}
        onOk={props.toggle}
        onCancel={props.toggle}
        width={1200}
        footer={null}
      >
        <Tabs
          defaultActiveKey="vendas"
          activeKey={tabState}
          onChange={(key) => setTabState(key)}
          items={[
            {
              key: "vendas",
              label: "Selecione as vendas para pagar",
              children: (
                <Container>
                  <Modal
                    title=""
                    open={!!selectedPayment}
                    onOk={() => setSelectedPayment(null)}
                    onCancel={() => setSelectedPayment(null)}
                    centered
                    width={600}
                    footer={null}
                  >
                    {paymentMetadataQuery.data && (
                      <>
                        <h4 style={{ marginTop: 16 }}>Vendas</h4>
                        <Table
                          columns={[
                            { title: "Tag", dataIndex: "tag", key: "tag" },
                            { title: "Valor Total", dataIndex: "totalValue", key: "totalValue", render: (val) => currencyFormatter(val) },
                          ]}
                          dataSource={paymentMetadataQuery.data.sales}
                          pagination={false}
                          rowKey="billId"
                        />
                        <h4 style={{ marginTop: 16 }}>Crédito</h4>
                        <Table
                          columns={[
                            { title: "ID", dataIndex: "id", key: "id" },
                            { title: "Valor Original", dataIndex: "originalValue", key: "originalValue", render: (val) => currencyFormatter(val) },
                            { title: "Valor Usado", dataIndex: "usedValue", key: "usedValue", render: (val) => currencyFormatter(val) },
                            { title: "Devolvido", dataIndex: "returned", key: "returned", render: (val) => <Checkbox checked={val} /> },
                          ]}
                          dataSource={paymentMetadataQuery.data.credits}
                          pagination={false}
                          rowKey="id"
                        />
                      </>
                    )}

                  </Modal>

                  <div className="uk-margin-top">
                    <Table
                      columns={[
                        Table.EXPAND_COLUMN,
                        {
                          title: "",
                          key: "controls",
                          width: 20,
                          render: (_, record) => (
                            <Checkbox
                              checked={selectedRows.includes(record.id)}
                              onChange={() => handleToggleSelected(record.id)}
                              disabled={record.mov !== "Venda"}
                            />
                          ),
                        },
                        {
                          title: "Tipo",
                          key: "mov",
                          dataIndex: "mov",
                        },
                        {
                          title: "Código",
                          key: "code",
                          dataIndex: "code",
                        },
                        {
                          title: "Data",
                          key: "date",
                          dataIndex: "date",
                        },
                        {
                          title: "Cliente",
                          key: "client",
                          dataIndex: "client",
                        },
                        {
                          title: "Paciente",
                          key: "patient",
                          dataIndex: "patient",
                        },

                        {
                          title: "Valor total",
                          key: "totalValue",
                          dataIndex: "totalValue",
                        },
                        {
                          title: "Valor em aberto",
                          key: "missingValue",
                          dataIndex: "missingValue",
                        },
                        {
                          title: "Status",
                          key: "status",
                          dataIndex: "status",
                        },
                      ]}
                      rowKey={"id"}
                      dataSource={(salesQuery.data ?? [])?.map((item) => ({
                        id: item.id,
                        code: item?.tag,
                        mov:
                          item._type === "sale"
                            ? "Venda"
                            : getWord("Orçamento"),
                        date: moment(item?.date).format("DD/MM/YYYY"),
                        clientID: item?.clientID,
                        client: item?.client,
                        patientID: item?.patientID,
                        patient: item?.patient,
                        totalValue: currencyFormatter(item?.total_value),
                        missingValue: currencyFormatter(item?.missing_value),
                        status:
                          item?._type === "sale"
                            ? billStatusFormatter(item)
                            : budgetStatusFormatter(item),
                      }))}
                      pagination={false}
                      expandable={{
                        expandedRowKeys,
                        onExpand: (expanded, record) =>
                          handleToggleExpand(expanded, record.id),
                        rowExpandable: (rec) => rec.mov === "Venda",
                        expandedRowRender: (record) => {
                          const rawData = salesQuery.data.find(
                            (d) => d.id === record.id,
                          );
                          if (!rawData) {
                            return null;
                          }

                          return (
                            <Table
                              columns={[
                                {
                                  title: "Produto",
                                  dataIndex: "product",
                                  key: "product",
                                },
                                {
                                  title: "Quantidade",
                                  dataIndex: "quantity",
                                  key: "quantity",
                                  render: (val) => (
                                    <InputNumber
                                      style={{
                                        backgroundColor:
                                          "rgba(50, 50, 50, 0.05)",
                                      }}
                                      readOnly
                                      value={val}
                                    />
                                  ),
                                },
                                {
                                  title: "Valor Unitário",
                                  dataIndex: "unitaryValue",
                                  key: "unitaryValue",
                                  render: (val) => (
                                    <AntInput
                                      style={{
                                        backgroundColor:
                                          "rgba(50, 50, 50, 0.05)",
                                      }}
                                      readOnly
                                      value={currencyFormatter(val)}
                                    />
                                  ),
                                },
                                {
                                  title: "Valor Desconto",
                                  dataIndex: "discountValue",
                                  key: "discountValue",
                                  render: (val) => (
                                    <AntInput
                                      style={{
                                        backgroundColor:
                                          "rgba(50, 50, 50, 0.05)",
                                      }}
                                      readOnly
                                      value={currencyFormatter(val)}
                                    />
                                  ),
                                },
                                {
                                  title: "Total",
                                  dataIndex: "totalValue",
                                  key: "totalValue",
                                  render: (val) => (
                                    <AntInput
                                      style={{
                                        backgroundColor:
                                          "rgba(50, 50, 50, 0.05)",
                                      }}
                                      readOnly
                                      value={currencyFormatter(val)}
                                    />
                                  ),
                                },
                                {
                                  title: "Cortesia",
                                  dataIndex: "courtesy",
                                  key: "courtesy",
                                  render: (val) => <Checkbox checked={val} />,
                                },
                              ]}
                              dataSource={rawData.items?.map((item) => ({
                                product:
                                  item.productVariation?.product?.description,
                                quantity: item.quantity,
                                unitaryValue: item.unitary_value,
                                discountValue: item.discount_value,
                                totalValue: item.total_value,
                                courtesy: item.courtesy,
                              }))}
                              pagination={false}
                            />
                          );
                        },
                        expandIcon: ({ expanded, onExpand, record }) => {
                          if (record.mov !== "Venda") {
                            return null;
                          }

                          return expanded ? (
                            <CgChevronDown
                              size={20}
                              onClick={(e) => onExpand(record, e)}
                            />
                          ) : (
                            <CgChevronUp
                              size={20}
                              onClick={(e) => onExpand(record, e)}
                            />
                          );
                        },
                      }}
                    />

                    <Divider />

                    <section
                      className="uk-flex uk-flex-column uk-flex-center"
                      style={{ marginTop: "20px" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "end",
                          gap: "1rem",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                      >
                        {selectedRows.length > 0 &&
                          virtualTotal > literalTotal && (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "end",
                                  marginLeft: "auto",
                                  marginRight: "auto",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "250px",
                                  }}
                                >
                                  <p>{`Diferença de ${currencyFormatter(virtualTotal - literalTotal)}`}</p>

                                  <Radio.Group
                                    onChange={(e) =>
                                      setOverflowType(e.target.value)
                                    }
                                  >
                                    <Radio
                                      value={"vale"}
                                      checked={overflowType === "vale"}
                                    >
                                      Vale Crédito
                                    </Radio>
                                    <Radio
                                      value={"troco"}
                                      checked={overflowType === "troco"}
                                    >
                                      Troco
                                    </Radio>
                                  </Radio.Group>

                                  {selectedClients.length > 1 && (
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label style={{}}>Cliente:</label>
                                      <Select
                                        style={{ width: "100%" }}
                                        options={selectedClients.map((d) => ({
                                          value: d.id,
                                          label: d.name,
                                        }))}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Divider />
                            </>
                          )}

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "250px",
                          }}
                        >
                          <label style={{ width: 140 }}>Valor a receber:</label>

                          <AntInput
                            value={currencyFormatter(virtualTotal)}
                            onInput={(e) => {
                              setVirtualTotal(
                                convertIntlCurrency(e.currentTarget.value),
                              );
                            }}
                          />
                        </div>

                        <Button
                          text="Pagar"
                          disabled={virtualTotal === 0}
                          style={{
                            cursor:
                              virtualTotal === 0 ? "not-allowed" : "pointer",
                          }}
                          onClick={() => setVisiblePayments(true)}
                        />
                      </div>

                    </section>
                    <TutorAggregatedCredits tutorID={props?.params?.tutor} selectedDebits={virtualTotal} />
                  </div>
                </Container>
              ),
            },
            {
              key: "pagamentos",
              label: "Pagamentos",
              children: (
                <Container>
                  <div className="uk-margin-top">
                    <Table
                      columns={[
                        {
                          title: "#",
                          key: "id",
                          dataIndex: "id",
                          render: (_, row) => (row.id === -1 ? "" : row.id),
                          render: (val, row) => {
                            if (row.id === -1) {
                              return "";
                            }
                            return (
                              <span
                                style={{
                                  cursor: "pointer",
                                  color: "#1890ff",
                                  textDecoration: "underline",
                                }}
                                onClick={() => setSelectedPayment(row.id)}
                              >
                                {row.id}
                              </span>
                            );
                          },
                        },
                        {
                          title: "Data de Pagamento",
                          key: "payment_date",
                          dataIndex: "payment_date",
                        },
                        {
                          title: "Valor",
                          key: "value",
                          dataIndex: "value",
                          render: (val, row) => {
                            if (row.id === -1) {
                              return "";
                            }
                            return (
                              <span
                                style={{
                                  cursor: "pointer",
                                  color: "#1890ff",
                                  textDecoration: "underline",
                                }}
                                onClick={() => setSelectedPayment(row.id)}
                              >
                                {row.value}
                              </span>
                            );
                          },
                        },
                        {
                          title: "Método de Pagamento",
                          key: "paymentMethod",
                          dataIndex: "paymentMethod",
                        },
                        {
                          title: "Parcelas",
                          key: "installments",
                          dataIndex: "installments",
                          render: (val, row) => {
                            if (row.id === -1) {
                              return val;
                            }
                            return (
                              <span
                                style={{
                                  cursor: "pointer",
                                  color: "#1890ff",
                                  textDecoration: "underline",
                                }}
                                onClick={() => setEditingInstallments(row.id)}
                              >
                                {val}
                              </span>
                            );
                          },
                        },
                        {
                          title: "Usuário",
                          key: "user",
                          dataIndex: "user",
                        },
                        {
                          title: "",
                          key: "actions",
                          dataIndex: "actions",
                          render: (_, row) =>
                            row.id === -1 ? null : (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: '6px'
                                }}
                              >

                                <BsEye
                                  size={16}
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setSelectedPaymentToPrint(row.id)
                                  }}
                                />

                                <Popconfirm
                                  title="Tem certeza que deseja remover este registro?"
                                  onConfirm={async () => {
                                    deleteClientPayments.mutate(row.id);
                                  }}
                                  disabled={deleteClientPayments.isFetching}
                                >
                                  <IoMdTrash
                                    size={16}
                                    style={{ cursor: "pointer" }}
                                  />
                                </Popconfirm>
                              </div>
                            ),
                        },
                      ]}
                      rowKey={"id"}
                      dataSource={(tutorPaymentsQuery.data ?? []).reduce(
                        (acc, item) => {
                          acc.unshift({
                            id: item.id,
                            value: currencyFormatter(item.value),
                            installments: `${item.installments}x`,
                            payment_date: moment(item?.payment_date).format(
                              "DD/MM/YYYY",
                            ),
                            paymentMethod:
                              item.paymentMethod?.description ?? "-",
                            paymentMethodData: item.paymentMethod,
                            user: item.user.name,
                          });

                          return acc;
                        },
                        [
                          {
                            id: -1,
                            value: currencyFormatter(totalPaymentValue),
                            payment_date: "Total",
                          },
                        ],
                      )}
                      pagination={false}
                    />

                    <Divider />

                    <section
                      className="uk-flex uk-flex-column uk-flex-center"
                      style={{ marginTop: "20px" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "end",
                          gap: "1rem",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                      >
                        {selectedRows.length > 0 &&
                          virtualTotal > literalTotal && (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "end",
                                  marginLeft: "auto",
                                  marginRight: "auto",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "250px",
                                  }}
                                >
                                  <p>{`Diferença de ${currencyFormatter(virtualTotal - literalTotal)}`}</p>

                                  <Radio.Group
                                    onChange={(e) =>
                                      setOverflowType(e.target.value)
                                    }
                                  >
                                    <Radio
                                      value={"vale"}
                                      checked={overflowType === "vale"}
                                    >
                                      Vale Crédito
                                    </Radio>
                                    <Radio
                                      value={"troco"}
                                      checked={overflowType === "troco"}
                                    >
                                      Troco
                                    </Radio>
                                  </Radio.Group>

                                  {selectedClients.length > 1 && (
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <label style={{}}>Cliente:</label>
                                      <Select
                                        style={{ width: "100%" }}
                                        options={selectedClients.map((d) => ({
                                          value: d.id,
                                          label: d.name,
                                        }))}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Divider />
                            </>
                          )}

                        {tabState === "vendas" && (
                          <>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                width: "250px",
                              }}
                            >
                              <label style={{ width: 140 }}>
                                Valor a receber:
                              </label>

                              <AntInput
                                value={currencyFormatter(virtualTotal)}
                                onInput={(e) => {
                                  setVirtualTotal(
                                    convertIntlCurrency(e.currentTarget.value),
                                  );
                                }}
                              />
                            </div>

                            <Button
                              text="Pagar"
                              disabled={virtualTotal === 0}
                              style={{
                                cursor:
                                  virtualTotal === 0
                                    ? "not-allowed"
                                    : "pointer",
                              }}
                              onClick={() => setVisiblePayments(true)}
                            />
                          </>
                        )}
                      </div>
                    </section>
                  </div>
                </Container>
              ),
            },
          ]}
        />
      </Modal>
    </>
  );
}

const PrintPaymentReceiptStyles = styled("div")`
  margin: 15px;
  .print-section {
    font-size: 20px;
    text-align: center;

    h2 {
      font-size: 23px;
      margin-top: 50px;
      margin-bottom: 30px;
    }

    .down-section {
      margin-top: 200px;
    }
  }

  table {
    width: 100%;
    margin-top: 20px;

    border-collapse: collapse;
  }

  thead {
    text-align: left;
  }

  tr {
    display: table-row;
    width: 100%;
  }

  th,
  td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    font-weight: bold;
  }

  td {
    text-align: left;
  }

  .localization {
    margin: 80px 0 60px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 20px;
  }
`;

function PrintPaymentReceipts(props: {
  clientPayment: ClientPaymentData | undefined
}) {
  const { clientPayment } = props

  if (!clientPayment) {
    return null
  }

  const firstBillPayment = clientPayment.billPayments?.[0]
  const bill = firstBillPayment?.bill

  return (
    <PrintPaymentReceiptStyles>
      <PrintHeader />
      <section className="print-section">
        <h2>Recibo de pagamento</h2>
        <div>
          <span>
            Recebi de {clientPayment?.client?.name}, inscrito no CPF/CNJP{" "}
            {clientPayment?.client?.tutor?.document} os valores listados abaixo,
            referentes à venda {bill?.tag} realizada no dia{" "}
            {bill?.bill_date ? moment(bill?.bill_date).format("DD/MM/YYYY") : '-'}
          </span>

          <table>
            <thead>
              <tr>
                <th>Data Vencimento</th>
                <th>Data Pagamento</th>
                <th>Valor R$</th>
                <th>Forma Pagamento</th>
              </tr>
            </thead>
            <tbody>
              {clientPayment?.billPayments?.length > 0 &&
                clientPayment?.billPayments?.flatMap((payment) => 
                  payment?.finances?.map((finance) => (
                    <tr key={finance?.id}>
                      <td>
                        {moment(finance?.expiration_date).format("DD/MM/YYYY")}
                      </td>
                      <td>
                        {finance?.payment_date ? moment(finance?.payment_date).format(
                          "DD/MM/YYYY"
                        ) : '-'}
                      </td>
                      <td>{currencyFormatter(finance?.value)}</td>
                      <td>{finance?.paymentMethod?.description}</td>
                    </tr>
                  ))
                )}
            </tbody>
          </table>

          <div className="localization">
            [{bill?.businessUnit?.city}, {moment().format("DD/MM/YYYY")}]
          </div>
        </div>

        <div className="unity">
          [{bill?.businessUnit?.company_name}, {firstBillPayment?.printUser?.name}]
        </div>
      </section>
    </PrintPaymentReceiptStyles>
  );
}
