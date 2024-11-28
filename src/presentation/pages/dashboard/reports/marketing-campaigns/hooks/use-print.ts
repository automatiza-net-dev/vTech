import { MarketingCampaingsReports } from "@/domain";
import { RefObject, useEffect, useState } from "react";

import { useReactToPrint } from "react-to-print";

export function usePrint({
  componentRef,
}: {
  componentRef: RefObject<HTMLDivElement>;
}) {
  const [campaingsReports, setCampaingsReports] = useState<
    MarketingCampaingsReports[]
  >([]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    if (typeof window !== undefined && campaingsReports.length > 0) {
      handlePrint();
      setCampaingsReports([]);
    }
  }, [campaingsReports]);

  return { campaingsReports, setCampaingsReports };
}
