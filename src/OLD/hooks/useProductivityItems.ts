import { useEffect, useState } from "react";
import { productivityItemsService } from "@/OLD/services/productivityItems.service";

export const useProductivityItems = (product) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (!product) {
      return;
    }

    setLoading(true);

    productivityItemsService
      .getProductivityItems({ product })
      .then((res) => setItems(res.data))
      .catch(() => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [product]);

  return {
    items,
    loadingItems: loading,
    fetchItems: fetchData,
  };
};
