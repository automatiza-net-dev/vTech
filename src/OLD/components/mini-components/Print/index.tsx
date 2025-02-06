// @ts-nocheck
import htmlParser from "html-react-parser";
import { useRef } from "react";

import { useProfile } from "@/OLD/hooks/useProfile";

import ReactToPrint, { useReactToPrint } from "react-to-print";

import PrintFooter from "./PrintFooter";
import PatientHeader from "./PetHeader";
import { PrintHeader } from "@/presentation";
import { Container, PrintScreen } from "./styles";

export default function Print({
  triggerComponent,
  content,
  title = false,
  string = true,
  onBeforePrint = false,
  tutor = false,
  patient = false,
}: any) {
  const { clinic, user } = useProfile();

  const componentRef: any = useRef();

  const imprimir = useReactToPrint({
    contentRef: componentRef,
    ignoreGlobalStyles: true,
  });

  return (
    <>
      {triggerComponent && (
        <button
          style={{ border: 0, padding: 0, background: "transparent" }}
          type="button"
          onClick={() => {
            onBeforePrint && onBeforePrint();
            imprimir();
          }}
        >
          {triggerComponent}
        </button>
      )}
      <div style={{ display: "none" }}>
        <PrintScreen ref={componentRef as any} className="uk-padding-small">
          <div className="">
            <PrintHeader />
          </div>

          {process.env.client !== "liftone" && patient && (
            <PatientHeader patient={patient} tutor={patient?.tutor} />
          )}
          {title && (
            <div className="uk-text-center uk-margin-top">
              <h5>
                <strong>{title}</strong>
              </h5>
            </div>
          )}
          <Container className="content-section">
            <div>
              {string && content
                ? htmlParser(content)
                : // <div dangerouslySetInnerHTML={{ __html: content.innerHTML }} />
                  null}
            </div>
            <PrintFooter user={user as any} />
          </Container>
        </PrintScreen>
      </div>
    </>
  );
}
