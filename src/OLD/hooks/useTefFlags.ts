import { useEffect, useState } from "react";
import { paymentMethodsService } from "@/OLD/services/paymentMethods.service";

export const useTefFlags = (reload, type) => {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    paymentMethodsService
      .getTefFlags(type)
      .then((res) => setFlags(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload, type]);

  return {
    tefFlags: flags,
    tefFlagsLoading: loading,
    fetchTefFlags: fetchData,
  };
};
