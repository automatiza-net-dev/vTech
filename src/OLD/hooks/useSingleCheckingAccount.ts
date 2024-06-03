import { useState, useEffect } from "react";
import { checkingAccountService } from "@/OLD/services/checkingAccount.service";

export const useSingleCheckingAccount = (id, reload) => {
  const [account, setAccount] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    checkingAccountService
      .showCheckingAccount(id)
      .then((res) => setAccount(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload, id]);

  return {
    checkingAccount: account,
    loadingCheckingAccount: loading,
    fetchCheckingAccount: fetchData,
  };
};
