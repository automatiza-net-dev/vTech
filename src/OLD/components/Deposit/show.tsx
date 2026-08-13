// @ts-nocheck
import { Col, Input, Row, Skeleton, Table, Typography } from "antd";
import "moment/locale/pt-br";
import { memo, useRef } from "react";
import { useQuery } from "infinity-forge";
import { depositService } from "@/OLD/services/deposit.service";

import { Button, PageWrapper } from "infinity-forge";
import PrintScreen from "./PrintScreen";

import { useRouter } from "next/router";

import { sortItems } from "@/OLD/utils/sortItems";
import ReactToPrint, { useReactToPrint } from "react-to-print";

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

export const ShowDeposit = memo(() => {
  const router = useRouter();

  const canEditDeposit = true;
  const canDeleteDeposit = true;
  const componentRef = useRef();

  const innerPage = router?.query?.innerpage as string;

  const showDepositQuery = useQuery({
    queryKey: ["deposit", innerPage],
    queryFn: () => depositService.getDeposit(innerPage).then((res) => res.data),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: router.isReady,
  });

  const isDisabled = showDepositQuery.isLoading;

  sortItems(showDepositQuery?.data?.items, "description");

  const imprimir = useReactToPrint({ contentRef: componentRef })

  return (
    <PageWrapper
      title={`Detalhes do depósito: ${showDepositQuery?.data?.description ?? ""
        }`}
    >
      <section>
        {showDepositQuery.isLoading && <Skeleton paragraph={{ rows: 4 }} />}
        {showDepositQuery.data && (
          <div>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={4}>
                <div className="uk-flex uk-flex-column">
                  <span>Código</span>
                  <Input value={showDepositQuery.data.id} readOnly />
                </div>
              </Col>

              <Col span={8}>
                <div className="uk-flex uk-flex-column">
                  <span>Descrição</span>
                  <Input value={showDepositQuery.data.description} readOnly />
                </div>
              </Col>

              <Col span={4}>
                <div className="uk-flex uk-flex-column">
                  <span>Tipo</span>
                  <Input value={showDepositQuery.data.type} readOnly />
                </div>
              </Col>

              <Col span={4}>
                <div className="uk-flex uk-flex-column">
                  <span>Principal</span>
                  <Input
                    value={showDepositQuery.data.principal ? "Sim" : "Não"}
                    readOnly
                  />
                </div>
              </Col>

              <Col span={4}>
                <div className="uk-flex uk-flex-column">
                  <span>Status</span>
                  <Input value={showDepositQuery.data.status} readOnly />
                </div>
              </Col>
            </Row>

            <hr />

            <h4 className="uk-margin-remove">Produtos</h4>
            <Table
              columns={columns}
              dataSource={(showDepositQuery.data.items ?? []).map((elem) => ({
                id: elem.id,
                description: elem.variation?.product ? elem.variation?.product?.description : 'Não informado',
                barcode: elem.variation.barcode ?? "Não informado",
                qty:
                  showDepositQuery?.data?.type === "Consumo"
                    ? "-"
                    : elem.quantity,
                status: elem.status,
              }))}
            />
          </div>
        )}
        <footer
          style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
        >

          <Button classCallback="uk-margin-small-right" text="Imprimir" onClick={() => imprimir()} />

          <Button onClick={() => router.back()} text="Voltar" />
        </footer>
        <div style={{ display: "none" }}>
          <div ref={componentRef}>
            <PrintScreen data={showDepositQuery?.data} />
          </div>
        </div>
      </section>
    </PageWrapper>
  );
});
