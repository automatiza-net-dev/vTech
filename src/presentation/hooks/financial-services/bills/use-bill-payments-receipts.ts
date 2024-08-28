import { useQuery } from "react-query";

import { BadRequestError, useToast } from "infinity-forge";

import { RemoteBills } from "@/data";
import { callApiOneTime } from "@/presentation";
import { LoadBillPaymentReceipts } from "@/domain";
import { TypesAutomatiza, container } from "@/container";

export function useBillPaymentsReceipts(
  params: LoadBillPaymentReceipts.Params & { fetch: boolean }
) {
  const { createToast } = useToast();

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
    onError: (err: { message: string }) => {
      if (err instanceof BadRequestError) {
        createToast({ message: err.error.message, status: "error" });
      }
    },
    ...callApiOneTime,
  });
}
