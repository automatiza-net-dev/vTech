import { useEffect, useState } from "react";
import { supplierService } from "@/OLD/services/supplier.service";

export const useSuppliers = (filters, reload = false) => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    supplierService
      .index(filters)
      .then((res) => setSuppliers(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [filters, reload]);

  return {
    suppliers,
    fetchSuppliers: fetchData,
    loadingSuppliers: loading,
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
