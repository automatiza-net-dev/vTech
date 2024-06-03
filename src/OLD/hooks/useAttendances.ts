// @ts-nocheck
import React, { useState, useEffect } from "react";
import { attendanceService } from "@/OLD/services/attendances.service.ts";

export const useAttendances = (id = false, reload) => {
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
