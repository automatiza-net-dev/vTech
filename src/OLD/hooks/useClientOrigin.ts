import { useEffect, useState } from "react";
import { clientService } from "@/OLD/services/client.service";

export const useClientOrigin = (filters) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    clientService
      .listAllClients(filters)
      .then((res) => setClients(res.data))
      .catch((err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    loadingClients: loading,
    fetchClients: fetchData,
    clients,
  };
};
