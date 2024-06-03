// @ts-nocheck
import { useEffect, useState } from "react";
import { bankingService } from "@/OLD/services/banking.service";
import moment from "moment";

export const useBankings = (filters = false, reload = false) => {
  const [bankings, setBankings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    bankingService
      .getAllBankings({
        ...filters,
        from: moment(filters?.from).startOf("day").toISOString(),
        to: moment(filters?.to).endOf("day").toISOString(),
      })
      .then((res) => setBankings(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    bankings,
    fetchBankings: fetchData,
    loadingBankings: loading,
  };
};

export const useSingleBanking = (id, reload) => {
  const [banking, setBanking] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchSingleBanking = () => {
    setLoading(true);
    id &&
      bankingService
        .getAllBankings(false)
        .then(({ data }) =>
          setBanking(data.find((banking) => banking?.id === id))
        )
        .catch((_err) => setLoading(false))
        .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSingleBanking();
  }, [id, reload]);

  return {
    banking,
    fetchSingleBanking,
    loadingBanking: loading,
  };
};
