import { useEffect, useState } from "react";
import { banksService } from "@/OLD/services/bank.service";

export const useBanks = (reload) => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    banksService
      .getAllBanks()
      .then((res) => setBanks(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    banks,
    loadingBanks: loading,
    fetchBanks: fetchData,
  };
};
