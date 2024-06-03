import { useEffect, useState } from "react";
import { recipeServices } from "@/OLD/services/recipes.service";

export function useMedicalRecipes(filters, reload) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    recipeServices
      .getAll(filters)
      .then((res) => {
        setDocuments(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload, filters]);

  return { documents, loadingDocuments: loading, fetchDocuments: fetchData };
}
