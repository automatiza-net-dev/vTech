import { useRouter } from "next/router";
import { useQueryClient } from "infinity-forge";
import { useToast } from "infinity-forge";

import { RemoteBudget } from "@/data";
import { container, TypesAutomatiza } from "@/container";
import { AxiosError } from "axios";

export function useNegotiation() {
  const router = useRouter();
  const { createToast } = useToast();
  const queryClient = useQueryClient();

  async function confirmBill(dataForm: any) {
    const containerBudget = container.get<RemoteBudget>(
      TypesAutomatiza.RemoteBudget,
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

    try {
      await Promise.all(promises);

      queryClient.invalidateQueries(["openNegotiations"]);

      createToast({
        message: "Negociação aprovada com sucesso",
        status: "success",
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        const messageArr = err?.response?.data?.message.split(":");
        return createToast({
          message: messageArr[1] ?? "Erro ao aprovar Negociação",
          status: "error",
        });
      }
    }
  }

  return {
    router,
    createToast,
    confirmBill,
    queryClient,
  };
}
