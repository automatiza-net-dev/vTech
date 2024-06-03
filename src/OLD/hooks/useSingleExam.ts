import { useState, useEffect } from "react";
import { examService } from "@/OLD/services/exams.service";

export const useSingleExam = (id) => {
  const [exam, setExam] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchSingleExam = () => {
    setLoading(false);
    examService
      .showExam(id)
      .then((res) => setExam(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSingleExam();
  }, [id]);

  return {
    exam,
    loadingExam: loading,
    fetchSingleExam,
  };
};
