// @ts-nocheck
import { memo, useEffect, useState } from "react";

import { useProfile } from "@/OLD/hooks/useProfile";

import PrintHeader from "@/OLD/components/mini-components/Print/PrintHeader";
import { Input } from "antd";
import { Container } from "./styles";
import moment from "moment";

const PrintScreen = memo(function PrintScreen({ data }) {
  const { clinic } = useProfile();

  useEffect(() => {}, [data]);

  return (
    <Container>
      <div className="clinic-header">
        <PrintHeader unit={clinic} />
        <div className="uk-text-center">
          <h4 className="">Movimentações estoque{data?.description}</h4>
        </div>
        <section className="uk-flex uk-margin-top" style={{ gap: "5px" }}>
          <div className="uk-width-1-5">
            <label>Código</label>
            <Input value={data?.id} readOnly />
          </div>
          <div className="uk-width-1-4">
            <label>Dt. Lanç.</label>
            <Input
              value={
                data?.date
                  ? moment(data?.date).format("DD/MM/YYYY - HH:mm")
                  : "-"
              }
              readOnly
            />
          </div>
          <div className="uk-width-1-3">
            <label>Deposito origem</label>
            <Input value={data?.fromDeposit?.description} readOnly />
          </div>
          <div className="uk-width-1-3">
            <label>Deposito destino</label>
            <Input value={data?.toDeposit?.description} readOnly />
          </div>
          <div className="uk-width-1-3">
            <label>Responsável</label>
            <Input value={data?.responsibleUser?.name} readOnly />
          </div>
          <div className="uk-width-1-3">
            <label>Solicitante</label>
            <Input value={data?.removalUser?.name} />
          </div>
        </section>
      </div>
      <div className="uk-flex content-box uk-flex-between uk-margin-top">
        <div>Descrição</div>
        <div>Qtd</div>
      </div>
      {data?.items?.map((item) => (
        <div className="uk-margin-top">
          <div className="uk-flex content-box uk-flex-between">
            <div>{item?.variation?.product?.description}</div>
            <div>{item?.quantity}</div>
          </div>
        </div>
      ))}
    </Container>
  );
});

export default PrintScreen;
