import moment from "moment";
import { Icon } from "infinity-forge";

import {
  useScheduling,
  PermissionItem,
  ScheduleActionType,
} from "@/presentation";

import { ActionSchedule } from "../../interface";

export function EditSchedule({ event, scheduleUser }: ActionSchedule) {
  const setCreateSchedulingArgs = useScheduling(
    (state) => state.setCreateSchedulingArgs
  );

  return (
    <PermissionItem hash="AGE02">
      <button
        className="reset-button"
        type="button"
        onClick={() => {
          const args = {
            event,
            type: "edit" as ScheduleActionType,
            scheduleUser,
            date: moment(event.start).add(3, "hours").toDate(),
            forceSelectUser: true,
          };

          setCreateSchedulingArgs(args);
        }}
      >
        <Icon name="IconEdit" />
        <span>Editar agendamento</span>
      </button>
    </PermissionItem>
  );
}
