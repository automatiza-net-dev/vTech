// @ts-nocheck
import { Col, Input, Row, Skeleton, Table, Typography } from "antd";
import PrintScreen from "./PrintScreen";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";
import "moment/locale/pt-br";
import { memo, useRef } from "react";
import { useQuery } from "react-query";
import { depositService } from "@/OLD/services/deposit.service";

import { useRouter } from "next/router";
import moment from "moment";
import ReactToPrint from "react-to-print";

const columns = [
  {
    title: "Descrição",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Código de barras",
    dataIndex: "barcode",
    key: "barcode",
  },
  {
    title: "Quantidade",
    dataIndex: "qty",
    key: "qty",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
];

export const ShowDepositMovement = memo(() => {
  const router = useRouter();
  const componentRef = useRef();

  const showDepositMovementQuery = useQuery({
    queryKey: ["deposit-movement", router.query.subpage],
    queryFn: () =>
      depositService
        .getDepositMovements({ ids: [router.query.subpage] })
        .then((res) => res.data),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: router.isReady,
  });

  const isDisabled = showDepositMovementQuery.isLoading;

  return (
    <section className="uk-padding">
      {showDepositMovementQuery.isLoading && (
        <Skeleton paragraph={{ rows: 4 }} />
      )}
      {showDepositMovementQuery.data && (
        <>
          {showDepositMovementQuery.data.map((depositMovement) => (
            <div key={`depo-movement-${depositMovement.id}`}>
              <div className="uk-flex uk-flex-between uk-flex-middle uk-margin-bottom">
                <h3 className="uk-margin-remove">
                  Movimentação {depositMovement.id} - Detalhes
                </h3>
              </div>

              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={2}>
                  <div className="uk-flex uk-flex-column">
                    <span>Código</span>
                    <Input value={depositMovement.id} readOnly disabled />
                  </div>
                </Col>

                <Col span={4}>
                  <div className="uk-flex uk-flex-column">
                    <span>Data Lançamento</span>
                    <Input
                      value={moment(depositMovement.date).format(
                        "DD/MM/YYYY HH:mm"
                      )}
                      readOnly
                      disabled
                    />
                  </div>
                </Col>

                <Col span={5}>
                  <div className="uk-flex uk-flex-column">
                    <span>Deposito Origem</span>
                    <Input
                      value={depositMovement.fromDeposit.description}
                      readOnly
                      disabled
                    />
                  </div>
                </Col>

                <Col span={5}>
                  <div className="uk-flex uk-flex-column">
                    <span>Deposito Destino</span>
                    <Input
                      value={depositMovement.toDeposit.description}
                      readOnly
                      disabled
                    />
                  </div>
                </Col>

                <Col span={4}>
                  <div className="uk-flex uk-flex-column">
                    <span>Usuário Responsável</span>
                    <Input
                      value={depositMovement.responsibleUser.name}
                      readOnly
                      disabled
                    />
                  </div>
                </Col>

                <Col span={4}>
                  <div className="uk-flex uk-flex-column">
                    <span>Usuário Solicitante</span>
                    <Input
                      value={depositMovement.removalUser.name}
                      readOnly
                      disabled
                    />
                  </div>
                </Col>
              </Row>

              <hr />

              <h4 className="">Produtos</h4>

              <Table
                columns={columns}
                dataSource={(depositMovement.items ?? []).map((elem) => ({
                  id: elem.id,
                  description: elem.variation.product.description,
                  barcode: elem.variation.barcode ?? "Não informado",
                  qty: elem.quantity,
                  status: elem.status,
                }))}
              />
            </div>
          ))}
        </>
      )}
      <div style={{ display: "none" }}>
        <div ref={componentRef}>
          <PrintScreen data={showDepositMovementQuery.data[0]} />
        </div>
      </div>
      <footer className="uk-flex uk-flex-right">
        <ReactToPrint
          trigger={() => (
            <CustomButton classCallback="uk-margin-small-right">
              Imprimir
            </CustomButton>
          )}
          content={() => componentRef?.current}
        />
        <CustomButton onClick={() => router.back()}>Voltar</CustomButton>
      </footer>
    </section>
  );
});
