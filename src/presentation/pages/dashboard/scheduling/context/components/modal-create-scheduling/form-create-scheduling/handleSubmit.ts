import moment from "moment";
import { BadRequestError, useToast, useQueryClient } from "infinity-forge";

import { RemoteCRM, RemoteSchedule } from "@/data";
import { CrmTypes, container, patientTypes } from "@/container";

import {
  useScheduling,
  DateToYYYYMMDD,
  useVerifyPermissions,
  useLoadAllSchedulesUser,
} from "@/presentation";

export function useSubmitSchedule() {
  const {
    selectedDate,
    setModalPatients,
    setOpportunities,
    createSchedulingArgs,
    setCreateSchedulingArgs,
  } = useScheduling((state) => state);

  const scheduleUsers = useLoadAllSchedulesUser({
    to: DateToYYYYMMDD(selectedDate || new Date()) || "",
    from: DateToYYYYMMDD(selectedDate || new Date()) || "",
  });

  const findBlokingEventsHours =
    scheduleUsers?.data
      ?.find((user) => {
        return user?.id === createSchedulingArgs?.scheduleUser?.id;
      })
      ?.events?.filter((event) => event?.type === "unavailable") || [];

  function eventoEstaDentroDoRangeDosHorariosBloqueados({
    startTime,
    duration = 0,
  }) {
    const startDateTime = new Date(`2000-01-01T${startTime}`);

    const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

    const isEventoDentroDoRange = findBlokingEventsHours?.some((event) => {
      const eventStart = new Date(`2000-01-01T${event.start}`);
      const eventEnd = new Date(`2000-01-01T${event.end}`);

      const isStartTimeWithinRange =
        startDateTime >= eventStart && startDateTime <= eventEnd;

      const isEndTimeWithinRange =
        endDateTime >= eventStart && endDateTime <= eventEnd;

      const isEventoCobreRange =
        startDateTime <= eventStart && endDateTime >= eventEnd;

      return (
        isStartTimeWithinRange || isEndTimeWithinRange || isEventoCobreRange
      );
    });

    return isEventoDentroDoRange;
  }

  const { createToast } = useToast();

  const ignoreBlocking = useVerifyPermissions("AGE12");
  const overbookingPermission = useVerifyPermissions("AGE11");

  async function submit(data, handlers) {
    const date = moment(data.date).format("YYYY-MM-DD");

    const startHour = moment(`${date}T${data.time}:00`);

    const meridianStartHour = startHour
      .subtract(3, "hours")
      .format("YYYY-MM-DDTHH:mm:ssZ");

    const meridianEndHour = moment(meridianStartHour)
      .add(Number(data.duration), "minutes")
      .format("YYYY-MM-DDTHH:mm:ssZ");

    if (data?.hasServicesStage && data?.executions.length === 0) {
      return createToast({
        message:
          "Selecione um ou mais itens de procedimentos disponíveis ou troque o serviço do agendamento",
        status: "error",
      });
    }

    const payload = {
      executions: data?.executions,
      endHour: meridianEndHour,
      startHour: meridianStartHour,
      scheduleOriginId: data?.scheduleOriginId
        ? data?.scheduleOriginId[0]
        : undefined,
      ignoreBlocking: ignoreBlocking || false,
      id: createSchedulingArgs?.event?.event?.id || "",
      ignoreOverlapping: data?.ignoreOverlapping || false,
      userId: data?.userId[0],
      holderId: data.holderId ? data.holderId[0] : undefined,
      holderName: data.holderName ? data.holderName[0] : undefined,
      patientId: data.patientId[0],
      patientName: data.patientName[0],
      majorComplaint: data.majorComplaint,
      scheduleServiceTypeId: data.scheduleServiceTypeId[0],
    };

    const validateRangeBloking = eventoEstaDentroDoRangeDosHorariosBloqueados({
      startTime: data.time,
      duration: Number(data.duration || 0),
    });

    try {
      if (
        !ignoreBlocking ||
        data.ignoreBlocking ||
        !validateRangeBloking ||
        (ignoreBlocking &&
          validateRangeBloking &&
          window.confirm(
            "Horário indisponivel na agenda, deseja prosseguir com o agendamento?"
          ))
      ) {
        if (createSchedulingArgs?.type === "reschedule") {
          await container
            .get<RemoteSchedule>(patientTypes.RemoteSchedule)
            .reschedule({
              endHour: meridianEndHour,
              startHour: meridianStartHour,
              reasonId: data.reasonId,
              userId: data?.userId[0],
              id: createSchedulingArgs.event?.event?.id || "",
              observation: data?.observation,
              ignoreBlocking: ignoreBlocking || false,
            });
        }

        if (createSchedulingArgs?.type === "edit") {
          await container
            .get<RemoteSchedule>(patientTypes.RemoteSchedule)
            .update(payload);
        }

        if (createSchedulingArgs?.type === "create") {
          const response = await container
            .get<RemoteSchedule>(patientTypes.RemoteSchedule)
            .create(payload);

          const opportunitiesSchedule = await container
            .get<RemoteCRM>(CrmTypes.RemoteCRM)
            .loadAll({
              client: payload.patientId,
              contact:
                process.env.client === "liftone"
                  ? payload.patientId
                  : payload.holderId,
            });

          if (
            opportunitiesSchedule &&
            opportunitiesSchedule.length > 0 &&
            response.schedule_service_type_type === "A"
          ) {
            setOpportunities(
              opportunitiesSchedule.map((r) => ({
                ...r,
                scheduleId: response.id,
              }))
            );
          }
        }

        createToast({ message: "Sucesso!!", status: "success" });

        setModalPatients(null);
        setCreateSchedulingArgs(null);

        scheduleUsers.mutate();

        return;
      }
    } catch (e) {
      if (e instanceof BadRequestError) {
        if (!overbookingPermission) {
          throw e;
        } else {
          if (e.error.message === "Pessoa não trabalha neste horário") {
            throw e;
          }

          if (
            window.confirm(
              "Profissional já possui Agendamento para este Horario, deseja continuar com o Agendamento ?"
            )
          ) {
            await submit(
              { ...data, ignoreOverlapping: true, ignoreBlocking },
              handlers
            );
          }
          return;
        }
      }

      throw e;
    }
  }

  return { submit, scheduleUsers: scheduleUsers?.data };
}
