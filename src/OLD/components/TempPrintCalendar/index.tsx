// @ts-nocheck
import { useRef } from "react";
import ReactToPrint from "react-to-print";

import { useAuth } from "@/OLD/hooks/useAuth";

import { Container } from "./styles";
import PrintTable from "./PrintTable";
import { Button } from "infinity-forge";

export function PrintSchedule({ data, date }) {
  

  
  const componentRef = useRef();
  return (
    <Container host={process.env.clientName}>
      <ReactToPrint
        content={() => componentRef?.current}
        trigger={() => <Button text="Imprimir">Imprimir</Button>}
      />
      <div style={{ display: "none" }}>
        <div ref={componentRef}>
          <PrintTable data={data} date={date} />
        </div>
      </div>
    </Container>
  );
}
