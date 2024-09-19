// @ts-nocheck
import { useState, useEffect } from "react";
import { calendarService } from "@/OLD/services/calendar.service";

export const useSchedules = (filters) => {
  const [schedules, setSchedules] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    calendarService
      .getHomeSchedules(filters)
      .then((res) => setSchedules(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    schedules,
    fetchSchedules: fetchData,
    loadingSchedules: loading,
  };
};

export const useSchedule = (id, reload) => {
  const [schedule, setSchedule] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (!id) {
      return;
    }

    setLoading(true);
    calendarService
      .showSchedule(id)
      .then((res) => setSchedule(res.data))
      .catch(() => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!id) {
      setSchedule({});
    }

    fetchData();
  }, [id, reload]);

  return {
    loadingSchedule: loading,
    fetchSchedule: fetchData,
    schedule,
  };
};

export const useSchedulesByPatient = (id, reload) => {
  const [schedules, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    calendarService
      .getSchedulesByPatient(id)
      .then((res) => setSchedule(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id, reload]);

  return {
    schedules,
    loadingSchedule: loading,
    fetchSchedule: fetchData,
  };
};

export const useSyncableSchedules = (filters) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    calendarService
      .getSyncableSchedules(filters)
      .then((res) => setSchedules(res.data))
      .catch((err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return {
    schedules,
    loadingSchedules: loading,
    fetchSchedules: fetchData,
  };
};
