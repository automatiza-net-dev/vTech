import { useEffect, useState } from "react";
import { supplierService } from "@/OLD/services/supplier.service";
import { useQuery } from "@/presentation";

export const useSuppliers = (filters) => {

  const { data, mutate, isLoading } = useQuery({
    queryKey: ["suppliers"], queryFn: async () => {

      const response = await supplierService
        .index(filters)
        .then((res) => res.data)

      return response
    }
  })

  return {
    suppliers: data,
    fetchSuppliers: mutate,
    loadingSuppliers: isLoading,
  };
};

export const useSingleSupplier = (id, reload = false) => {
  const [supplier, setSupplier] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    supplierService
      .show(id)
      .then((res) => setSupplier(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id, reload]);

  return {
    supplier,
    fetchSuplier: fetchData,
    loadingSupplier: loading,
  };
};
