import { api, useQuery } from "infinity-forge";

import { useFormikContext } from "formik";

export type ProductDepartament = {
  id: string;
  description: string;
  type: "service" | "product";
  courtesy: boolean;
  stock: number;
  maximum_discount_percentage: number;
  price: number;
  cost_price: number;
}

export type ItemDepartament = {
  id: number;
  description: string;
  photo: string;
  requiresObservation: boolean;
  order: number;
}

export type DepartmentItem = {
  id: number;
  description: string;
  image: string | null;
  items: ItemDepartament[];
  products: ProductDepartament[];
};

export function useDepartamentItems() {
  const { values } = useFormikContext<{ departament: string | undefined }>();

  return useQuery({
    queryKey: ["DepartamentItems", values?.departament],
    queryFn: async () => {
      const response = await api({
        url: "departments/list-products-movements",
        method: "get",
        body: { departmentId: values?.departament },
      });

      return response as DepartmentItem[];
    },
    enabled: !!values.departament,
    enableCache: true,
  });
}
