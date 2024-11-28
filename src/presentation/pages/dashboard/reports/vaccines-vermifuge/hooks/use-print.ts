import { useEffect, useState, RefObject } from "react";

import { useReactToPrint } from "react-to-print";

import { Vaccine } from "@/domain";

export function usePrint({
  componentRef,
}: {
  componentRef: RefObject<HTMLDivElement>;
}) {
  const [vaccinesReport, setVaccinesReport] = useState<Vaccine[]>([]);

  const print = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    if (typeof window !== undefined && vaccinesReport.length > 0) {
      print();
      setVaccinesReport([]);
    }
  }, [vaccinesReport]);

  return { vaccinesReport, setVaccinesReport };
}
