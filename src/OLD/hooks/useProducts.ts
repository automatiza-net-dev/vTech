// @ts-nocheck
import { useEffect, useState } from "react";
import { productService } from "@/OLD/services/product.service";
import { unitsService } from "@/OLD/services/units.service";

export const useSingleProduct = (id, reload) => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    productService
      .showProduct(id)
      .then((res) => setProduct(res))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id, reload]);

  return {
    product,
    fetchProduct: fetchData,
    loadingProduct: loading,
  };
};

export const useUnits = (type) => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    unitsService
      .listUnits(type)
      .then((res) => setUnits(res.data))
      .catch((err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [type]);

  return {
    units,
    fetchUnits: fetchData,
    loadingUnits: loading,
  };
};
