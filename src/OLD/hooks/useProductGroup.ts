import { useEffect, useState } from "react";
import { productService } from "@/OLD/services/product.service";

export const useProductsGroup = (filters, reload) => {
  const [productsGroup, setProductsGroup] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    productService
      .listProductsGroup(filters)
      .then((res) => setProductsGroup(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload, filters]);

  return {
    productsGroup,
    loadingProductsGroup: loading,
    fetchProductsGroup: fetchData,
  };
};

export const useShowProductGroup = (id, reload) => {
  const [productGroup, setProductGroup] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    productService
      .showProductGroup(id)
      .then((res) => setProductGroup(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    id && fetchData();
  }, [id, reload]);

  return {
    productGroup,
    loadingProductGroup: loading,
    fetchProductGroup: fetchData,
  };
};
