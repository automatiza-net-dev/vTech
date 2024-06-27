import moment from "moment";

import {
  useScheduling,
  PermissionItem,
  ScheduleActionType,
  useLoadAllPatientTutor,
  useLoadSchedulesPatients,
} from "@/presentation";

import { ActionSchedule } from "../../interface";
import { Icon } from "infinity-forge";

export function EditSchedule({ event, scheduleUser }: ActionSchedule) {
  const setCreateSchedulingArgs = useScheduling(
    (state) => state.setCreateSchedulingArgs
  );

  const { data } = useLoadSchedulesPatients({});

  const tutors = useLoadAllPatientTutor({});

  return (
    <PermissionItem hash="AGE02">
      <button
        className="reset-button"
        type="button"
        onClick={() => {
          const itemToReschedule =
            process.env.client === "sancla"
              ? data?.find((item) => item.id === event.event.patient.id)
              : tutors?.data?.find(
                  (item) => item.id === event.event.patient.id
                );

          const args = {
            ...itemToReschedule as any,
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
