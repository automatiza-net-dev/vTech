import { useEffect, useState } from "react";
import { pathologiesServices } from "@/OLD/services/pathologies.service";

export function usePathologies(filters, reload) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    pathologiesServices
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
