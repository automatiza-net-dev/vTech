import { useEffect, useState, RefObject } from "react";

import { useReactToPrint } from "react-to-print";

import { Vaccine } from "@/domain";

export function usePrint({
  componentRef,
}: {
  componentRef: any
}) {
  const [vaccinesReport, setVaccinesReport] = useState<Vaccine[]>([]);

  const print = useReactToPrint({
    contentRef:  componentRef,
    pageStyle: `
    @page {
      size: A4 landscape; 
      margin: 10mm;
    }

    body {
      font-family: sans-serif;
    }
  `,
  });

  useEffect(() => {
    if (typeof window !== undefined && vaccinesReport.length > 0) {
      print();
      setVaccinesReport([]);
    }
  }, [vaccinesReport]);

  return { vaccinesReport, setVaccinesReport };
}
