import { Icon } from "infinity-forge";

import { useScheduling, PermissionItem } from "@/presentation";

import { ActionSchedule } from "../../interface";

export function RescheduleAppointment({ event, scheduleUser }: ActionSchedule) {
  const setCreateSchedulingArgs = useScheduling(
    (state) => state.setCreateSchedulingArgs
  );

  async function handleClick() {
    setCreateSchedulingArgs({
      event,
      type: "reschedule",
      scheduleUser,
      date: new Date(),
    });
  }

  return (
    <PermissionItem hash="AGE04">
      <button className="reset-button" type="button" onClick={handleClick}>
        <Icon name="IconEdit" />
        <span>Reagendar consulta</span>
      </button>
    </PermissionItem>
  );
}
