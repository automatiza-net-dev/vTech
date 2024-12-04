import { useState } from "react";
import { useRouter } from "next/router";

import { useLoadSchedulesMock } from "@/presentation";

import { Service } from "./components/service";
import { AvailableSchedules } from "./components";
import { DropdownComponentProps } from "../dropdown-item";

export function Avaliation(props: DropdownComponentProps) {
  const router = useRouter();
  const id = router.query?.scheduleId as string | undefined;
  const [scheduleId, setScheduleId] = useState(id);

  const { data, mutate } = useLoadSchedulesMock({ enabled: !id });

  if (!scheduleId && props.modal && data?.length > 0) {
    return <AvailableSchedules data={data} setMockScheduleId={setScheduleId} />;
  }

  return <Service {...props} scheduleId={scheduleId} mutate={!id && mutate} />;
}
