import { useRef } from "react";

import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { FormHandler, Input, Textarea, Button } from "infinity-forge";

import { TimeLine } from "@/domain";

import { PrintHeader } from "@/presentation";

import * as S from "./styles";


export function HospitalizationForm(props: TimeLine["timeline_info"]) {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const risks = [
    { value: 1, label: "Leve" },
    { value: 2, label: "Médio" },
    { value: 3, label: "Grave" },
    { value: 4, label: "Gravíssimo" },
  ];

  return (
    <S.HospitalizationForm>
      <FormHandler
        customAction={{
          Component: () => (
            <div className="footer-container">
              <Button text="Imprimir" onClick={() => handlePrint()} />
            </div>
          ),
        }}
        initialData={{
          ...props,
          risk: risks?.find((risk) => risk.value === props.risk)?.label,
          expectedDischarge: props?.expectedDischarge
            ? moment(props.expectedDischarge).format("DD/MM/YYYY")
            : "",
          technician: props.technician.name,
          bed: props?.bed?.name,
        }}
      >
        <section>
          <Input name="type" label="Situação" readOnly />
          <Input name="risk" label="Grau de risco" readOnly />
          <Input name="bed" label="Leito de internação" readOnly />
          <Input name="expectedDischarge" label="Previsão Alta" readOnly />
        </section>
        <Input name="technician" label="Veterinário" readOnly />
        <Textarea name="complaint" label="Queixa" disabled />
        <Textarea name="diagnosis" label="Diagnostico" disabled />
        <Textarea name="prognosis" label="Prognóstico" disabled />
        <section className="print-section">
          <div
            ref={componentRef}
            className="print-component"
            style={{ margin: "10px" }}
          >
            <div>
              <PrintHeader />
              <h3 style={{ marginTop: "20px", textAlign: "center" }}>
                Entrada internação
              </h3>
            </div>
            <div style={{ marginTop: "30px" }}>
              <h4 style={{ textAlign: "center" }}>Queixa</h4>
              <div>{props.complaint}</div>
            </div>
            <div style={{ marginTop: "30px" }}>
              <h4 style={{ textAlign: "center" }}>Diagnóstico</h4>
              <div>{props.diagnosis}</div>
            </div>
            <div style={{ marginTop: "30px" }}>
              <h4 style={{ textAlign: "center" }}>Diagnóstico</h4>
              <div>{props.prognosis}</div>
            </div>
          </div>
        </section>
      </FormHandler>
    </S.HospitalizationForm>
  );
}
