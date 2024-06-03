import { useState, useEffect } from "react";
import { contactTypeService } from "@/OLD/services/contactType.service";

export const useContactTypes = (reload) => {
  const [contactTypes, setContactTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    contactTypeService
      .getAll()
      .then((res) => setContactTypes(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    loadingContactTypes: loading,
    fetchContactTypes: fetchData,
    contactTypes,
  };
};
