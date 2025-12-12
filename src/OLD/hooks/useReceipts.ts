import { receiptService } from "@/OLD/services/receipt.service";
import { useEffect, useState } from "react";

import moment from "moment";

export const useReceiptProducts = () => {
  const [products, setProducts] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    receiptService
      .getProducts()
      .then((res) => setProducts(res.data))
      .catch(() => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    products,
    loadingProducts: loading,
    fetchProducts: fetchData,
  };
};

export const useReceipts = (filters, reload) => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (filters?.noSearch) {
      return;
    }

    const keys = Object.keys(filters);
    let newObject = { ...filters };

    if (keys?.includes("from")) {
      newObject = {
        ...filters,
        from: moment(newObject.from).format("YYYY-MM-DD"),
        to: moment(newObject.to).format("YYYY-MM-DD"),
      };
    }

    if (keys?.includes("tag") && filters["tag"] !== "") {
      newObject = {
        tag: newObject?.tag,
      };
    }

    setLoading(true);
    receiptService
      .getReceipts(newObject)
      .then((res) => setReceipts(res.data))
      .catch(() => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    receipts,
    loadingReceipts: loading,
    fetchReceipts: fetchData,
  };
};

export const useReceipt = (ids, reload) => {
  const [receipt, setReceipt] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (!ids?.ids || ids?.ids?.length === 0) {
      return;
    }

    setLoading(true);
    receiptService
      .getReceipt(ids)
      .then((res) => setReceipt(res.data))
      .catch(() => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [ids, reload]);

  return {
    receipt,
    loadingReceipt: loading,
    fetchReceipt: fetchData,
    refetch: fetchData,
  };
};

export const useReceiptsWithProducts = (reload) => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    receiptService
      .getReceiptsWithProduct()
      .then((res) => setReceipts(res.data))
      .catch((err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    receipts,
    loadingReceipts: loading,
    fetchReceipts: fetchData,
  };
};

export const useReceiptsFiscalDocuments = (filters) => {
  const [fiscalDocuments, setFiscalDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (!filters?.bill) {
      return;
    }

    setLoading(true);
    receiptService
      .getFiscalDocuments(filters)
      .then((res) => setFiscalDocuments(res.data))
      .catch((err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return {
    fiscalDocuments,
    loadingFiscalDocuments: loading,
    fetchFiscalDocuments: fetchData,
  };
};
