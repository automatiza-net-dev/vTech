// @ts-nocheck
import { useMutation, useQuery } from "react-query";
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
  return useMutation((budget) => budgetService.cancelBudget(id, budget));
};

export const useFindCompleteBudgets = (params) => {
  return useQuery(["budgets", "complete", params], () =>
    budgetService.getCompleteBudgets(params)
  );
};

export const useCreateBudget = () => {
  return useMutation((budget) => budgetService.createBudget(budget));
};

export const useConfirmBudget = (id) => {
  return useMutation((budget) => budgetService.confirmBudget(id, budget));
};

export const useCompleteBudget = (id, enabled = false) => {
  return useQuery(
    ["budgets", "show", id],
    () => budgetService.getCompleteBudget(id),
    {
      enabled,
    }
  );
};

export const useCreateBudgetItem = () => {
  return useMutation((data) => budgetService.createBudgetItem(data));
};

export const useUpdateBudgetItem = () => {
  return useMutation((data) => budgetService.updateBudgetItem(data.id, data));
};

export const useUpdateSellerAndReviewer = (id) => {
  return useMutation((data) =>
    budgetService.updateBudgetSellerAndReviewer(id, data)
  );
};

export const useBudgetProducts = (enabled = false) => {
  return useQuery(
    ["budgets", "products"],
    () => budgetService.getBudgetProducts(),
    {
      enabled,
    }
  );
};

export const useBudgetsFromAttendance = (id, reload) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (!id) {
      return;
    }

    setLoading(true);
    budgetService
      .getBudgetsFromAttendance(id)
      .then((res) => setBudgets(res.data))
      .catch(() => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id, reload]);

  return {
    budgets,
    loadingBudgets: loading,
    fetchBudgets: fetchData,
  };
};

export const useBudgetPayments = (id, reload, fetch = true) => {
  const [budgetPayments, setBudgetPayments] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (!id || !fetch) {
      return;
    }

    setLoading(true);
    budgetService
      .getBudgetPayments(id)
      .then((res) => setBudgetPayments(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id, reload, fetch]);

  return {
    budgetPayments,
    loadingPayments: loading,
    fetchPayments: fetchData,
  };
};
