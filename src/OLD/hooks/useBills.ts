// @ts-nocheck
import { useEffect, useState } from "react";
import { useMutation, useQueries, useQuery } from "react-query";
import api from "@/OLD/services";
import { billService } from "@/OLD/services/bills.service";
import moment from "moment";

export const useGetAllBills = (params, reload) => {
  return useQuery(
    ["bills", reload],
    async () => {
      let newObj = { ...params };
      const keys = Object.keys(params);
      if (newObj?.tag) {
        newObj = { tag: newObj?.tag };
      }

      if (keys?.includes("fromBill") && newObj?.fromBill) {
        newObj = {
          ...params,
          fromBill: moment(newObj.fromBill).format("YYYY-MM-DD"),
          toBill: moment(newObj.toBill).format("YYYY-MM-DD"),
        };
      }

      const data = !params?.noSearch
        ? await billService.getAllBills(newObj)
        : [];

      return data ?? [];
    },
    { refetchOnWindowFocus: false }
  );
};

export const useGetBillProducts = (visible) => {
  return useQuery(
    ["bills", "products"],
    async () => {
      const data = await billService.getBillProducts();

      return data ?? [];
    },
    {
      enabled: visible,
    }
  );
};

export const useCreateBill = () => {
  return useMutation(async (formData) => {
    const data = await billService.createBill(formData);

    return data;
  });
};

export const useCreateBillItem = () => {
  return useMutation(async (formData) => {
    const data = await billService.createBillItem(formData);

    return data;
  });
};

export const useCreateBillPayment = () => {
  return useMutation(async (formData) => {
    const data = await billService.createBillPayment(formData);

    return data;
  });
};

export const useTaxationGroupRules = (enabled) => {
  return useQuery(
    ["taxation-group-rules"],
    async () => {
      const { data } = await api.get("/taxation-group-rules");

      return data;
    },
    {
      enabled,
    }
  );
};

export const useShowBill = (id, enabled) => {
  return useQuery(
    ["bills", id],
    async () => {
      if (!id) {
        return (data = {});
      }
      return billService.getSingleBill(id);
    },
    {
      enabled,
    }
  );
};

export const useFiscalData = (filters) => {
  const [fiscalData, setFiscalData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    billService
      .getFiscalData(filters)
      .then((res) => setFiscalData(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return {
    fiscalData,
    fetchFiscalData: fetchData,
    loadingFiscalData: loading,
  };
};
