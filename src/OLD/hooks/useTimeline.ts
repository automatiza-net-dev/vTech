import { useState, useEffect } from "react";
import { timelineService } from "@/OLD/services/timeline.service";

export const useTimeline = (id, visible, reload) => {
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    timelineService
      .listPatientHospitalizationTimeline(id)
      .then((res) => setTimelineData(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    visible && fetchData();
  }, [id, visible, reload]);

  return {
    fetchHospitalizationTimeline: fetchData,
    loadingHospitalization: loading,
    timelineData,
  };
};

export const useCompleteHospitalizationsTimeline = (
  id,
  fetch = true,
  reload
) => {
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (!id || !fetch) {
      return;
    }
    setLoading(true);

    timelineService
      .getCompleteHospitalizationsTimeline(id)
      .then((res) => setTimelineData(res.data))
      .catch((err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id, reload]);

  return {
    timelineData,
    loadingTimeline: loading,
    fetchTimelineData: fetchData,
  };
};
