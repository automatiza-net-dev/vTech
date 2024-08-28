import { billService } from "@/OLD/services/bills.service";
import { callApiOneTime } from "@/presentation";
import { useQuery } from "react-query";

export function useLoadBill({ billId }) {
  async function fetcher() {
    const response = await billService.getSingleBill(billId);

    return response;
  }

  return useQuery({
    queryKey: ["RemoteLoadBill", billId],
    queryFn: fetcher,
    ...callApiOneTime,
  });
}
