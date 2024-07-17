import { useQuery } from "react-query";

import { LoadBillPaymentReceipts } from "@/domain";
import { RemoteBills } from "@/data";
import { callApiOneTime } from "@/presentation";
import { TypesAutomatiza, container } from "@/container";

export function useBillPaymentsReceipts(
  params: LoadBillPaymentReceipts.Params & { fetch: boolean }
) {
  return useQuery({
    queryKey: ["billPaymentsReceipts", params],
    queryFn: async () => {
      if (!params.fetch) {
        return {};
      }
      const response = await container
        .get<RemoteBills>(TypesAutomatiza.RemoteBills)
        .loadBillReceipts(params);

      return response;
    },
    ...callApiOneTime,
  });
}
