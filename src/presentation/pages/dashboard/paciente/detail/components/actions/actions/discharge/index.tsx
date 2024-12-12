import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import { TimeLine } from "@/domain";

import { Input, FormHandler, Button } from "infinity-forge";

import Editor from "@/OLD/components/Editor";
import { PrintHeader } from "@/presentation";

import moment from "moment";

import * as S from "./styles";

export function DischargeForm(props: TimeLine["timeline_info"]) {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <S.DischargeForm>
      <FormHandler
        initialData={{
          ...props,
          technician: props?.technician?.name,
          realized: props?.realized
            ? moment(props.realized).format("DD/MM/YYYY")
            : "",
        }}
        customAction={{
          Component: () => (
            <div className="footer-container">
              <Button text="Imprimir" onClick={() => handlePrint()} />
            </div>
          ),
        }}
      >
        <Input name="technician" label="Veterinário responsável" readOnly />
        <Input name="realized" label="Data Alta" readOnly />
        <Input name="resume" label="Tipo Alta" readOnly />
        <div>
          <label>Relatório alta</label>
          <Editor editorState={props.description} readOnly />
        </div>

        <section className="print-section">
          <div
            ref={componentRef}
            className="print-component"
            style={{ margin: "10px" }}
          >
            <div>
              <PrintHeader />
              <h3 style={{ marginTop: "20px", textAlign: "center" }}>
                Relatório alta
              </h3>
            </div>
            <div style={{ marginTop: "30px" }}>
              {props?.description && (
                <div dangerouslySetInnerHTML={{ __html: props.description }} />
              )}
            </div>
          </div>
        </section>
      </FormHandler>
    </S.DischargeForm>
  );
}
