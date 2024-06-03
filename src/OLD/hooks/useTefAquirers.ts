import { useState, useEffect } from "react";
import { paymentMethodsService } from "@/OLD/services/paymentMethods.service";

export const useTefAcquirers = () => {
  const [acquirers, setAcquirers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    paymentMethodsService
      .getTefFlagsAcquirers()
      .then((res) => setAcquirers(res.data))
      .catch((err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    acquirers,
    loadingAcquirers: loading,
    fetchAcquirers: fetchData,
  };
};
