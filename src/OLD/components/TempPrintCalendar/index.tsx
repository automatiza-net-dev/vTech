// @ts-nocheck
import { useRef } from "react";
import ReactToPrint, { useReactToPrint } from "react-to-print";

import { useAuth } from "@/OLD/hooks/useAuth";

import { Container } from "./styles";
import PrintTable from "./PrintTable";
import { Button } from "infinity-forge";
import { useConfigurationsSystem } from "@/presentation";

export function PrintSchedule({ data, date }) {

  const {name} = useConfigurationsSystem()
  
  const componentRef = useRef();
  const imprimir = useReactToPrint({ contentRef:componentRef  })
  
  return (
    <Container host={name}>
     <Button text="Imprimir" onClick={() => imprimir()}>Imprimir</Button>

      <div style={{ display: "none" }}>
        <div ref={componentRef}>
          <PrintTable data={data} date={date} />
        </div>
      </div>
    </Container>
  );
}
