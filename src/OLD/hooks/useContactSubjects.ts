import { contactSubjectService } from "@/OLD/services/contactSubjects.service";
import { useState, useEffect } from "react";

export const useContactSubjects = (reload) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    contactSubjectService
      .getAll()
      .then((res) => setSubjects(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    subjects,
    loadingSubjects: loading,
  };
};
