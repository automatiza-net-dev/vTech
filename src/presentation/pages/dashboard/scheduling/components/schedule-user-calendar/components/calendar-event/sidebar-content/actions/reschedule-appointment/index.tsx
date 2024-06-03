import { Icon } from "semantic-ui-react";

import { ActionSchedule } from "../interface";
import {
  PermissionItem,
  useLoadSchedulesPatients,
  useScheduling,
} from "@/presentation";

export function RescheduleAppointment({ event, scheduleUser }: ActionSchedule) {
  const setCreateSchedulingArgs = useScheduling(
    (state) => state.setCreateSchedulingArgs
  );

  const { data } = useLoadSchedulesPatients({});

  async function handleClick() {
    const itemToReschedule = await data?.find((item) => {
      return item.id === event.event.patient.id;
    });

    setCreateSchedulingArgs({
      event,
      type: "reschedule",
      scheduleUser,
      date: new Date(),
      id: itemToReschedule?.id,
    });
  }

  return (
    <PermissionItem hash="AGE04">
      <button className="reset-button" type="button" onClick={handleClick}>
        <Icon name="repeat" />
        <span>Reagendar consulta</span>
      </button>
    </PermissionItem>
  );
}
