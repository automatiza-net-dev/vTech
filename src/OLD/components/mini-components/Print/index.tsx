// @ts-nocheck
import htmlParser from "html-react-parser";
import { useRef } from "react";

import { useProfile } from "@/OLD/hooks/useProfile";

import ReactToPrint from "react-to-print";

import PrintFooter from "./PrintFooter";
import PatientHeader from "./PetHeader";
import PrintHeader from "./PrintHeader";
import { Container, PrintScreen } from "./styles";

export default function Print({
  triggerComponent,
  content,
  title = false,
  string = true,
  onBeforePrint = false,
  patient = false,
}: any) {
  const { clinic, user } = useProfile();
  
  const componentRef: any = useRef();

  return (
    <>
      <ReactToPrint
        trigger={() => triggerComponent}
        content={() => componentRef.current}
        onBeforePrint={() => onBeforePrint && onBeforePrint()}
      />
      <div style={{ display: "none" }}>
        <PrintScreen ref={componentRef as any} className="uk-padding-small">
          <div className="uk-text-center uk-margin-top">
            <PrintHeader unit={clinic} />
          </div>
          {process.env.client !== "liftone" && patient && (
            <PatientHeader patient={patient} />
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
