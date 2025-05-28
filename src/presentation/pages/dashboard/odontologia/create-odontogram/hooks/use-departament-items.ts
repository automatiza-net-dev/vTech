import { useQuery } from "@/presentation/use-query";
import { api } from "infinity-forge";

import { Product } from "@/domain";

import { useFormikContext } from "formik";

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
  products: Product[];
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
    
  });
}
