import { useEffect, useState } from "react";
import { documentServices } from "@/OLD/services/document.service";

export function useDocuments(filters, reload) {
  const [documents, setDocuments] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    documentServices
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
