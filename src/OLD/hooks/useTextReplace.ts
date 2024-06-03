import { useState, useEffect } from "react";
import { textReplaceService } from "@/OLD/services/textReplace.service";

export const useTextReplace = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    textReplaceService
      .listAll()
      .then((res) => setTemplates(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    templates,
    loadingTemplates: loading,
    fetchTemplates: fetchData,
  };
};
