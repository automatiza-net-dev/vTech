// @ts-nocheck
import { Button, Modal, Table, Tooltip } from "antd";
import * as React from "react";
import { AiOutlineZoomIn } from "react-icons/ai";
import { billStatusFormatter } from "..";
import { useShowBill } from "../../../../OLD/hooks/useBills";
import { currencyFormatter, dateFormatter } from "../../Budget";

const columns = [
  {
    title: "Qtd",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Descrição",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Valor Unitário",
    dataIndex: "unitary_value",
    key: "unitary_value",
    render: (value) => (value !== "-" ? currencyFormatter(value) : "-"),
  },
  {
    title: "Desconto",
    dataIndex: "discount_value",
    key: "discount_value",
    render: (value) => (value !== "-" ? currencyFormatter(value) : "-"),
  },
  {
    title: "Cortesia",
    dataIndex: "courtesy",
    key: "courtesy",
    render: (value) => <input checked={value} />,
  },
  {
    title: "Valor Total",
    dataIndex: "total_value",
    key: "total_value",
    render: (value) => currencyFormatter(value),
  },
];

const mapper = (data = []) => {
  const mapped = data.map((item) => ({
    quantity: item.quantity,
    description: item.productVariation.product.description,
    status: billStatusFormatter(item.status),
    unitary_value: item.unitary_value,
    discount_value: item.discount_value,
    total_value: item.total_value,
  }));

  mapped.push({
    quantity: data.reduce((acc, item) => acc + item.quantity, 0),
    description: "== TOTAL ==",
    status: "-",
    unitary_value: "-", //data.reduce((acc, item) => acc + item.unitary_value, 0),
    discount_value: "-", //data.reduce((acc, item) => acc + item.discount_value, 0),
    total_value: data.reduce((acc, item) => acc + item.total_value, 0),
  });

  return mapped;
};

const ShowBill = React.memo(function ShowBill({ bill }) {
  const [visible, setVisible] = React.useState(false);

  const { data } = useShowBill(bill.id, visible);

  return (
    <>
      <Tooltip title="Mostrar Nota de Saída">
        <AiOutlineZoomIn
          className="icon"
          size={20}
          onClick={() => {
            setVisible((prevState) => !prevState);
          }}
        />
      </Tooltip>

      <Modal
        visible={visible}
        footer={null}
        title={`Mostrar Nota de Saída - ${bill?.tag ?? ""}`}
        width={1200}
        onCancel={() => setVisible((prevState) => !prevState)}
      >
        <div>
          <div
            className="uk-flex uk-flex-between"
            style={{ paddingBottom: "1rem" }}
          >
            <div className="uk-flex uk-flex-column uk-width-1-1">
              <span className="uk-text-small">Data de Criação</span>
              <span className="uk-text-default">
                {dateFormatter(data?.budget_date)}
              </span>
            </div>

            <div className="uk-flex uk-flex-column uk-width-1-1">
              <span className="uk-text-small">Data de Expiração</span>
              <span className="uk-text-default">
                {dateFormatter(data?.expiration_date)}
              </span>
            </div>

            <div className="uk-flex uk-flex-column uk-width-1-1">
              <span className="uk-text-small">Finalizado em</span>
              <span className="uk-text-default">
                {data?.finished_at ? dateFormatter(data?.finished_at) : "-"}
              </span>
            </div>

            <div className="uk-flex uk-flex-column uk-width-1-1">
              <span className="uk-text-small">Status</span>
              <span className="uk-text-default">
                {billStatusFormatter(data?.status)}
              </span>
            </div>
          </div>

          <hr />

          <div
            className="uk-flex uk-flex-between"
            style={{ paddingBottom: "1rem" }}
          >
            <div className="uk-flex uk-flex-column uk-width-1-1">
              <span className="uk-text-small">Cliente</span>
              <span className="uk-text-default">{data?.client.name}</span>
            </div>

            <div className="uk-flex uk-flex-column uk-width-1-1">
              <span className="uk-text-small">CPF/CNPJ</span>
              <span className="uk-text-default">
                {data?.client.tutor.document}
              </span>
            </div>

            <div className="uk-flex uk-flex-column uk-width-1-1">
              <span className="uk-text-small">Paciente</span>
              <span className="uk-text-default">
                {data?.patient?.name ?? ""}
              </span>
            </div>
          </div>

          {Boolean(data?.cancellation_observation) && (
            <>
              <hr />

              <div
                className="uk-flex uk-flex-between"
                style={{ paddingBottom: "1rem" }}
              >
                <div className="uk-flex uk-flex-column uk-width-1-1">
                  <span className="uk-text-small">Motivo</span>
                  <span className="uk-text-default">
                    {data?.cancellation_observation.reason}
                  </span>
                </div>
              </div>
            </>
          )}

          <hr />

          <div
            className="uk-flex uk-flex-between"
            style={{ paddingBottom: "1rem" }}
          >
            <div className="uk-flex uk-flex-column uk-width-1-1">
              <span className="uk-text-small">Observação</span>
              <span className="uk-text-default">
                {data?.observation ?? "-"}
              </span>
            </div>
          </div>

          <hr />

          <div className="uk-flex uk-flex-column uk-width-1-1">
            <span className="uk-text-small">Produtos</span>

            <Table
              columns={columns}
              dataSource={mapper(data?.items)}
              pagination={false}
              scroll={{ y: 1000 }}
            />
          </div>

          <footer className="uk-flex uk-flex-right">
            <div
              className="uk-width-1-1 uk-flex uk-flex-right"
              style={{ gap: "1rem" }}
            >
              <Button
                onClick={() => {
                  setVisible((prevState) => !prevState);
                }}
              >
                Fechar
              </Button>
            </div>
          </footer>
        </div>
      </Modal>
    </>
  );
});

export default ShowBill;
