import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { useToast } from "infinity-forge";

import { RemoteBudget } from "@/data";
import { container, TypesAutomatiza } from "@/container";

export function useNegotiation() {
  const router = useRouter();
  const { createToast } = useToast();
  const queryClient = useQueryClient();

  async function confirmBill(dataForm: any) {
    const containerBudget = container.get<RemoteBudget>(
      TypesAutomatiza.RemoteBudget
    );

    const promises = dataForm.budgets.map(async (budget) => {
      if (budget.checked) {
        return containerBudget.confirm({
          financialResponsibleId: budget?.financialResponsibleId,
          id: budget.id,
          finishedAt: new Date(),
          notConfirmedItems: [],
          type: "TOTAL",
        });
      }

      return containerBudget.cancel({
        id: budget.id,
        canceledObservation: budget.observacao,
        finishedAt: new Date(),
        reasonId: budget.motivo,
        internalObservation: "",
      });
    });

    await Promise.all(promises);

    queryClient.invalidateQueries({
      queryKey: ["openNegotiations", router?.query?.id as string],
    });

    createToast({
      message: "Negociação aprovada com sucesso",
      status: "success",
    });
  }

  return {
    router,
    createToast,
    confirmBill,
    queryClient,
  };
}
