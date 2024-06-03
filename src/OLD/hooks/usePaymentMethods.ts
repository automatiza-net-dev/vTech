// @ts-nocheck
import { useEffect, useState } from "react";
import { paymentMethodsService } from "@/OLD/services/paymentMethods.service";

export const usePaymentMethods = (
  filters = false,
  reload = false,
  search = true
) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (!search) {
      return;
    }
    setLoading(true);
    paymentMethodsService
      .getComplete(filters)
      .then((res) => {
        const sortedPaymentMethods = res.data.sort((a, b) =>
          a.description.localeCompare(b.description)
        );
        setPaymentMethods(sortedPaymentMethods);
      })
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload, filters, search]);

  return {
    paymentMethods,
    loadingPaymentMethods: loading,
    fetchPaymentMethods: fetchData,
  };
};
