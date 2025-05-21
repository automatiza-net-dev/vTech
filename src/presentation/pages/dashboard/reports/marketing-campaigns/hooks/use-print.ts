import { MarketingCampaingsReports } from "@/domain";
import { useEffect, useState } from "react";

import { useReactToPrint } from "react-to-print";

export function usePrint({
  componentRef,
}: {
  componentRef: any;
}) {
  const [campaingsReports, setCampaingsReports] = useState<
    MarketingCampaingsReports[]
  >([]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  useEffect(() => {
    if (typeof window !== undefined && campaingsReports.length > 0) {
      handlePrint();
      setCampaingsReports([]);
    }
  }, [campaingsReports]);

  return { campaingsReports, setCampaingsReports };
}
