import { useState, useEffect } from "react";
import { attendanceService } from "@/OLD/services/attendances.service";
import { useQuery } from "infinity-forge";
import { treatmentService } from "../services/treatments.service";

export const useAttendances = (id = false, reload: any) => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (!id) {
      return;
    }
    setLoading(true);
    attendanceService
      .listAttendance({ patient: id })
      .then((res) => setAttendances(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id, reload]);

  return {
    attendances,
    fetchAttendances: fetchData,
    loadingAttendances: loading,
  };
};

export const useTreatmentsNotExecuted = (props: {
  enabled: boolean;
  patientID: string;
  holderID?: string;
}) =>
  useQuery({
    enabled: props.enabled,
    queryKey: ["search-not-executed", props.patientID, props.holderID],
    queryFn: async () => {
      const response = await treatmentService.searchNotExecuted({
        client: props.patientID,
        holder: props.holderID,
      });

      return response.data;
    },
  });
