
import { Icon } from "infinity-forge";
import { ActionSchedule } from "../interface";
import {
  useScheduling,
  PermissionItem,
  useLoadSchedulesPatients,
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
        <Icon name="IconEdit" />
        <span>Reagendar consulta</span>
      </button>
    </PermissionItem>
  );
}
