// @ts-nocheck
import { memo, useEffect, useState } from "react";

import { useProfile } from "@/OLD/hooks/useProfile";

import { PrintHeader } from "@/presentation";
import { Container } from "./styles";

const PrintScreen = memo(function PrintScreen({ data }) {
  const { clinic } = useProfile();

  useEffect(() => {}, [data]);

  return (
    <Container>
      <div className="clinic-header">
        <PrintHeader />
        <div className="uk-text-center">
          <h4 className="">Detalhes depósito - {data?.description}</h4>
        </div>
      </div>
      <div className="uk-flex content-box uk-flex-between">
        <div className="uk-width-1-1">Descrição</div>
        <div className="uk-width-1-3">Qtd</div>
        <div className="uk-width-1-3">Status</div>
      </div>
      {data?.items?.map((item) => (
        <div className="uk-margin-top">
          <div className="uk-flex content-box uk-flex-between">
            <div className="uk-width-1-1">
              {item?.variation?.product?.description}
            </div>
            <div className="uk-width-1-3">{item?.quantity}</div>
            <div className="uk-width-1-3">{item?.status}</div>
          </div>
        </div>
      ))}
    </Container>
  );
});

export default PrintScreen;
