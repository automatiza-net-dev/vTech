import { useEffect, useState } from "react";
import { useMutation, useQuery } from "infinity-forge";
import { billService } from "@/OLD/services/bills.service";
import moment from "moment";

export const useGetAllBills = (params, enabled = true) => {
  return useQuery({
    enabled,
    queryKey: ["bills", params],
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

      return data as {
        hasDocuments: boolean;
        id: string;
        bill_date: string;
        total_value: number;
        internal_code: string | null;
        cancelled_at: string | null;
        cancelled: boolean;
        cancellation_observation: string | null;
        bill_type: string;
        transfer_confirmation_date: string | null;
        status: string;
        created_at: string;
        updated_at: string;
        tag: string;
        closing_date: string | null;
        paid_value: number;
        documents_status: string;
        pending: boolean;
        origin_bill_id: string;
        client: {
          id: string;
          name: string;
          type: string;
        };
        patient: {
          id: string;
          name: string;
          type: string;
        };
        seller: {
          id: string;
          name: string;
        };
        creator: {
          id: string;
          name: string;
        };
        confirmation_user: {
          id: string;
          name: string;
        } | null;
        destination_unit: any;
        receipts: never[];
        bill_related_type: { id: string; description: string } | null;
      }[];
    },
  });
};

export const useGetBillProducts = (visible) => {
  return useQuery({
    queryKey: ["bills", "products"],
    queryFn: async () => {
      const data = await billService.getBillProducts();

      return data ?? [];
    },
    enabled: visible,
  });
};

export const useCreateBill = () => {
  return useMutation({
    queryKey: ["useCreateBill"],
    queryFn: async (formData) => {
      const data = await billService.createBill(formData);

      return data;
    },
  });
};

export const useCreateBillItem = () => {
  return useMutation({
    queryKey: ["useCreateBillItem"],
    queryFn: async (formData) => {
      const data = await billService.createBillItem(formData);

      return data;
    },
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
    interval: "5s",
  });
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
