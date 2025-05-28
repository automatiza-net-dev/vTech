// @ts-nocheck
import { useEffect, useState } from "react";
import { checkingAccountService } from "@/OLD/services/checkingAccount.service";

import { useProfile } from "./useProfile";

export const useCheckingAccounts = (
  reload = false,
  filters = false,
  unit = false
) => {
  const [checkingAccounts, setCheckingACcounts] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const { clinic } = useProfile();

  const newObj = { ...filters, unit: clinic?.id };

  if (unit) {
    delete newObj?.unit;
  }

  const fetchData = () => {
    setLoading(true);
    checkingAccountService
      .listAllCheckingAccounts(newObj)
      .then((res) => setCheckingACcounts(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload, filters]);

  return {
    checkingAccounts,
    loadingAccounts: loading,
    fetchCheckingAccounts: fetchData,
  };
};
