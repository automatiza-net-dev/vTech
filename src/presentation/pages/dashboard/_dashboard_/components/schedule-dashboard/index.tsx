import { LoaderCircle } from "infinity-forge";

import { useLoadSchedules, SchedulingContextProvider } from "@/presentation";

import { SchedulesCarousel } from "./schedules-carousel";

export function SchedulesDashboard() {
  const { data, isLoading } = useLoadSchedules();

  if (isLoading) {
    return <LoaderCircle size={30} color="#000" />;
  }

  return (
    <SchedulingContextProvider>
      <div style={{ marginTop: 30 }}>
        {data?.nonConfirmed && (
          <SchedulesCarousel confirmed event={data?.nonConfirmed} />
        )}

        {data?.confirmed && (
          <SchedulesCarousel confirmed={false} event={data?.confirmed} />
        )}
      </div>
    </SchedulingContextProvider>
  );
}
