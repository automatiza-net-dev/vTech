// @ts-nocheck
import React, { memo, useState } from "react";
import { useRouter } from "next/router";

import { useTreatment } from "@/OLD/hooks/useTreatment";
import { useShowBill } from "@/OLD/hooks/useBills";

import { Container } from "./styles";
import { Input, DatePicker, Collapse } from "antd";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";
import ExecutionForm from "./ExecutionForm";
const { Panel } = Collapse;

import moment from "moment";

const Maintenance = memo(function Maintenance() {
  const [reload, setReload] = useState(false);

  const router = useRouter();

  const { treatment } = useTreatment(router.query.innerpage, reload);

  return (
    <Container className="uk-padding">
      <h3 className="uk-margin-remove">Tratamentos</h3>
      <section className="custom-body uk-padding">
        <div className="uk-flex">
          <div className="uk-margin-right uk-width-1-5">
            <label>Cód. Tratamento</label>
            <Input value={treatment?.id} disabled />
          </div>
          <div className="uk-margin-right">
            <label>Data</label>
            <br />
            <DatePicker
              format="DD/MM/YYYY"
              value={moment(treatment?.emissionDate)}
              disabled
            />
          </div>
          <div className="uk-width-1-2 uk-margin-right">
            <label>Cliente</label>
            <Input
              value={treatment?.client?.name}
              className="uk-width-1-1"
              disabled
            />
          </div>
          <div className="uk-width-1-2">
            <label>Vendedor</label>
            <Input
              value={treatment?.seller?.name}
              className="uk-width-1-1"
              disabled
            />
          </div>
        </div>
        <h5 className="uk-heading-line">
          <span>Items e execuções</span>
        </h5>
        {treatment?.items
          ?.sort((a, b) => {
            if (
              a.productVariation?.description?.toLowerCase() <
              b.productVariation?.description?.toLowerCase()
            ) {
              return -1;
            }

            if (
              a.productVariation?.description?.toLowerCase() >
              b.productVariation?.description?.toLowerCase()
            ) {
              return 1;
            }

            return 0;
          })
          .map((item) => (
            <Collapse key={item?.id}>
              <Panel
                header={
                  <div className="uk-flex">
                    <div className="uk-margin-right">
                      <strong>{item?.productVariation?.description}</strong>
                    </div>
                    <div className="uk-margin-left">
                      <span>Quantidade: {item?.quantity}</span>
                    </div>
                    <div className="uk-margin-left">
                      <span>
                        Quantidade Agendada: {item?.scheduledQuantity || 0}{" "}
                      </span>
                    </div>
                    <div className="uk-margin-left">
                      <span>
                        Quantidade Executada: {item?.quantityExecuted || 0}{" "}
                      </span>
                    </div>
                  </div>
                }
              >
                <ExecutionForm
                  data={{
                    treatmentItem: item,
                    treatment: treatment,
                    executions: treatment?.executions.filter(
                      (execution) => item?.id === execution?.item?.id
                    ),
                  }}
                  reload={reload}
                  setReload={setReload}
                />
              </Panel>
            </Collapse>
          ))}
      </section>
      <CustomButton classCallback="uk-margin-top" onClick={() => router.back()}>
        Salvar
      </CustomButton>
    </Container>
  );
});

export default Maintenance;
