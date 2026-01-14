// @ts-nocheck
import * as React from "react";
import { Input as AntInput, Checkbox, Divider, InputNumber, Modal, Select, Table, Radio } from "antd";
import { Button } from "infinity-forge";
import { Container } from "../styles";
import {
  budgetStatusFormatter,
  currencyFormatter,
} from "@/OLD/components/Budget";
import { CgChevronDown, CgChevronUp } from "react-icons/cg";
import { useDictionary, useQuery } from "@/presentation";
import { petsService } from "@/OLD/services/patient.service";
import moment from "moment";
import { billStatusFormatter } from "../utils/status-formater";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import AddBillPayment from "../Actions/AddBillPayment";

export default function AddBillPaymentWithCredits(props: {
  isOpen: boolean;
  toggle: () => void;
  params: { tutor: string; patient?: string };
}) {
  const [expandedRowKeys, setExpandedRowKeys] = React.useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<React.Key[]>([]);
  const [visiblePayments, setVisiblePayments] = React.useState(false)
  const { getWord } = useDictionary();

  const salesQuery = useQuery({
    enabled: props.isOpen,
    queryKey: ["sales-metadata-add-credits", props.params],
    queryFn: async () => {
      if (!props.params.patient) {
        return [];
      }

      const result = await petsService.getPatientSalesMetadata(
        props.params.patient,
        props.params.tutor,
        {
          onlyOpen: 1 
        }
      );

      return result.data;
    },
  });

  React.useEffect(() => {
    if (!salesQuery.data) {
      return
    }

    setSelectedRows(salesQuery.data.map(d => d.id))
  }, [setSelectedRows, salesQuery.data])

  const [overflowType, setOverflowType] = React.useState<null | 'vale' | 'troco'>(null)

  const selectedData = salesQuery.data
    ? salesQuery.data.filter((d) => selectedRows.includes(d.id))
    : [];
  
  const literalTotal = selectedData.reduce(
    (acc, current) => acc + Number.parseFloat(current.missing_value),
    0,
  );
  const selectedClients = selectedData.reduce((acc, curr) => {
    if (!acc.find((d) => d.id === curr.clientID)) {
      acc.push({ id: curr.clientID, name: curr.client });
    }
    return acc
  }, [] as { id: string, name: string }[]);
  
  const [virtualTotal, setVirtualTotal] = React.useState(0);
  React.useEffect(() => {
    setVirtualTotal(
      selectedRows.reduce(
        (acc, current) =>
          acc +
          Number.parseFloat(
            salesQuery.data?.find((d) => d.id === current)?.missing_value ?? "0",
          )
        ,
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

  return (
    <>

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
          creditOverflow={overflowType === 'vale'}
          literalTotal={literalTotal}
          virtualTotal={virtualTotal}
        />


      </Modal>


      <Modal
        title="Selecione as vendas para pagar"
        open={props.isOpen}
        onOk={props.toggle}
        onCancel={props.toggle}
        width={1200}
        footer={null}
      >
        <Container>
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
                mov: item._type === "sale" ? "Venda" : getWord("Orçamento"),
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
                  const rawData = salesQuery.data.find((d) => d.id === record.id);
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
                                backgroundColor: "rgba(50, 50, 50, 0.05)",
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
                                backgroundColor: "rgba(50, 50, 50, 0.05)",
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
                                backgroundColor: "rgba(50, 50, 50, 0.05)",
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
                                backgroundColor: "rgba(50, 50, 50, 0.05)",
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
                        product: item.productVariation?.product?.description,
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
                    <CgChevronUp size={20} onClick={(e) => onExpand(record, e)} />
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
                {selectedRows.length > 0 && virtualTotal > literalTotal && (
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

                        <Radio.Group onChange={(e) => setOverflowType(e.target.value)}>
                          <Radio value={'vale'} defaultChecked>Vale Crédito</Radio>
                          <Radio value={'troco'}>Troco</Radio>
                        </Radio.Group>


                        {selectedClients.length > 1 && (
                          <div style={{ display: "flex", flexDirection: 'column' }}>
                            <label style={{}}>Cliente:</label>
                            <Select
                              style={{ width: '100%' }}
                              options={selectedClients.map((d) => ({ value: d.id, label: d.name }))}
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
                      setVirtualTotal(convertIntlCurrency(e.currentTarget.value));
                    }}
                  />
                </div>

                <Button text="Pagar" disabled={virtualTotal === 0} style={{
                  cursor: virtualTotal === 0 ? 'not-allowed' : 'pointer'
                }}
                  onClick={() => setVisiblePayments(true)}
                />
              </div>
            </section>
          </div>
        </Container>
      </Modal>
    </>
  );
}
