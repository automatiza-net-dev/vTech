import { useEffect, useState } from "react";
import { useMutation, useQuery } from "infinity-forge";
import { billService } from "@/OLD/services/bills.service";
import moment from "moment";

export const useGetAllBills = (params, reload) => {
  return useQuery({
    queryKey: ["bills", reload, params],
    queryFn: async () => {
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
  }
  );
};

export const useGetBillProducts = (visible) => {
  return useQuery({
    queryKey: ["bills", "products"],
    queryFn: async () => {
      const data = await billService.getBillProducts();

      return data ?? [];
    },
    enabled: visible,
  }
  );
};

export const useCreateBill = () => {
  return useMutation({
    queryKey: ["useCreateBill"], queryFn: async (formData) => {
      const data = await billService.createBill(formData);

      return data;
    }
  });
};

export const useCreateBillItem = () => {
  return useMutation({
    queryKey: ["useCreateBillItem"], queryFn: async (formData) => {
      const data = await billService.createBillItem(formData);

      return data;
    }
  });
};


export const useShowBill = (id, enabled) => {
  return useQuery({
    queryKey: ["bills", id],
    queryFn: async () => {
      const response = await billService.getSingleBill(id);

      return response;
    },
    enabled: enabled && !!id,
    interval: '5s'
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
