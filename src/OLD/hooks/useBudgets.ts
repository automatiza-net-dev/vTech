import { useMutation, useQuery } from "@/presentation/use-query";
import { budgetService } from "@/OLD/services/budgets.service";

import moment from "moment";
import { useEffect, useState } from "react";

export const useFindPartialBudgets = (params, reload) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = () => {
    if (params?.noSearch) {
      return;
    }
    const keys = Object.keys(params);

    let newObject = { ...params };

    if (keys?.includes("fromCreation") && newObject?.fromCreation) {
      newObject = {
        ...newObject,
        fromCreation: moment(newObject.fromCreation).format("YYYY-MM-DD"),
        toCreation: moment(newObject.toCreation).format("YYYY-MM-DD"),
      };
    }

    if (keys?.includes("fromExpiration") && newObject?.fromExpiration) {
      newObject = {
        ...newObject,
        fromExpiration: moment(newObject.fromExpiration).format("YYYY-MM-DD"),
        toExpiration: moment(newObject.toExpiration).format("YYYY-MM-DD"),
      };
    }

    if (!newObject?.fromCreation) {
      delete newObject?.fromCreation;
      delete newObject?.toCreation;
    }

    if (!newObject.fromExpiration) {
      delete newObject?.fromExpiration;
      delete newObject?.toExpiration;
    }

    budgetService
      .getPartialBudgets(newObject)
      .then((res) => setData(res))
      .catch((err) => setLoading(false))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    data,
    refetch: fetchData,
    loading,
  };
};

export const useCancelBudget = (id) => {
    return useMutation({
    queryKey: ["useCancelBudget"],
    queryFn: (budget) => budgetService.cancelBudget(id, budget)
  }
  );
};

export const useFindCompleteBudgets = (params) => {
  return useQuery({
    queryKey: ["budgets", "complete", params], queryFn: () =>
      budgetService.getCompleteBudgets(params)
  }
  );
};

export const useCreateBudget = () => {
  return useMutation({
    queryKey: ["useCreateBudget"],
    queryFn: (budget) => budgetService.createBudget(budget)
  }
  );
};

export const useConfirmBudget = (id) => {
  return useMutation({
    queryKey: ["useConfirmBudget"],
    queryFn: (budget) => budgetService.confirmBudget(id, budget)
  }
  );
};

export const useCompleteBudget = (id, enabled = false) => {
  return useQuery<any>({
    queryKey: ["budgets", "show", id], enabled, queryFn: () => {
      if (!id) {
        return {} as any;
      }
      return budgetService.getCompleteBudget(id) as any;
    }
  }
  );
};

export const useCreateBudgetItem = () => {
  return useMutation({
    queryKey: ["useCreateBudgetItem"],
    queryFn: (data) =>
      budgetService.createBudgetItem(data)
  }
  );
};

export const useUpdateBudgetItem = () => {
  return useMutation({
    queryKey: ["useUpdateBudgetItem"],
    queryFn: (data) =>
      budgetService.updateBudgetItem(data)
  }
  );
};

export const useUpdateSellerAndReviewer = (id) => {
  return useMutation({
    queryKey: ["useUpdateSellerAndReviewrMutation"],
    queryFn: (data) =>
      budgetService.updateBudgetSellerAndReviewer(id, data)
  }
  );
};

export const useBudgetProducts = (enabled = false) => {
  return useQuery({
    queryKey: ["budgets", "products"],
    queryFn: async () => budgetService.getBudgetProducts({}),
    enabled
  }
  );
};
