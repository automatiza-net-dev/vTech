// @ts-nocheck
import { memo } from "react";

import { useProfile } from "@/OLD/hooks/useProfile";

import { Empty } from "antd";
import { Container, RowBox } from "./styles";
import { PrintHeader } from "@/presentation";

import { currencyFormatter } from "@/OLD/components/Budget";

export default function PrintTable({ data = [], loading }) {
  const { clinic } = useProfile();

  return (
    <>
      <Container>
        <div className="clinic-header">
          <PrintHeader />
          <div className="uk-text-center">
            <h4 className="">Relatório de vendas</h4>
          </div>
        </div>
        <div className="table-section">
          <section className="header-table">
            <div>Unidade de negócios</div>
            <div>Cidade</div>
            <div>Uf</div>
            <div>Tipo</div>
            <div>Descrição</div>
            <div>Qtd vendida</div>
            <div>Qtd vendas</div>
            <div>Qtd Clientes</div>
            <div>Valor vendido</div>
            <div>% Participação</div>
          </section>
          <section className="table-box">
            {loading ? (
              <div className="uk-text-center">Carregando...</div>
            ) : data?.length > 0 ? (
              data?.map((item) => (
                <RowBox>
                  <div>{item?.unit?.identification}</div>
                  <div>{item?.unit?.state}</div>
                  <div>{item?.unit?.city}</div>
                  <div>{item?.product?.type}</div>
                  <div>{item?.product?.description}</div>
                  <div>{item?.quantity}</div>
                  <div>{item?.sales}</div>
                  <div>{item?.clients}</div>
                  <div>{currencyFormatter(item?.totalValue)}</div>
                  <div>{item?.percentage?.toFixed(2)}%</div>
                </RowBox>
              ))
            ) : (
              <Empty className="uk-margin-top" />
            )}
          </section>
        </div>
      </Container>
    </>
  );
}


