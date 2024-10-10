import moment from "moment";
import { Input, Select, Textarea, FormHandler } from "infinity-forge";

import {
  SelectHolder,
  SelectPatient,
  SelectServices,
  SelectReturnable,
  SelectRescheduleReason,
} from "./components";

import {
  useMe,
  useScheduling,
  DateToYYYYMMDD,
  useLoadAllSchedulesUser,
} from "@/presentation";
import { useSubmitSchedule } from "./handleSubmit";

import * as S from "./styles";

export function FormCreateScheduling() {
  const me = useMe();
  const { submit } = useSubmitSchedule();
  const selectedDate = useScheduling((state) => state.selectedDate);
  const { data } = useLoadAllSchedulesUser(
    DateToYYYYMMDD(selectedDate || new Date()) || "",
    DateToYYYYMMDD(selectedDate || new Date()) || ""
  );
  const createSchedulingArgs = useScheduling(
    (state) => state.createSchedulingArgs
  );

  const initialData = {
    userId: createSchedulingArgs?.scheduleUser?.id
      ? [createSchedulingArgs?.scheduleUser?.id]
      : [],
    majorComplaint: createSchedulingArgs?.event?.event?.major_complaint || "",
    scheduleServiceTypeId: createSchedulingArgs?.event?.event?.serviceType
      ? [createSchedulingArgs?.event?.event?.serviceType?.id]
      : [],
    holderId:
      process.env.client === "sancla"
        ? createSchedulingArgs?.event?.event?.holder?.id
          ? [createSchedulingArgs?.event?.event?.holder?.id || ""]
          : createSchedulingArgs?.tutors?.find((tutor) => tutor.isMain)?.id
          ? [
              createSchedulingArgs?.tutors?.find((tutor) => tutor.isMain)?.id ||
                "",
            ]
          : []
        : undefined,
    time: createSchedulingArgs?.date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    date: moment(createSchedulingArgs?.date).format("YYYY-MM-DD"),
    patientId:
      process.env.client === "liftone"
        ? [
            createSchedulingArgs?.event?.event?.patient?.id ||
              createSchedulingArgs?.id,
          ]
        : process.env.client === "sancla"
        ? createSchedulingArgs?.id
          ? [createSchedulingArgs?.id]
          : []
        : createSchedulingArgs?.tutors?.find((tutor) => tutor.isMain)?.id
        ? [
            createSchedulingArgs?.tutors?.find((tutor) => tutor.isMain)?.id ||
              "",
          ]
        : [],
  };

  const users = data?.map((user) => ({ label: user.name, value: user.id }));

  return (
    <S.FormCreateScheduling>
      <FormHandler
        isStickyButtons
        button={{ text: "Agendar" }}
        onSucess={submit}
        initialData={initialData}
        cleanFieldsOnSubmit={false}
      >
        <div className="top">
          <h2 className="font-18-bold">
            {createSchedulingArgs?.type === "reschedule"
              ? "Reagendamento"
              : createSchedulingArgs?.type === "edit"
              ? "Alterar Agendamento"
              : "Criar agendamento"}
          </h2>
        </div>

        {(createSchedulingArgs?.forceSelectUser ||
          !createSchedulingArgs?.scheduleUser?.id) && (
          <Select name="userId" label="Usuário" options={users || []} />
        )}

        <div className="row">
          <div style={{ width: "92%" }}>
            <SelectServices />

            <SelectReturnable />
          </div>

          <div style={{ width: "35%" }}>
            <Input
              type="number"
              name="duration"
              readOnly={
                !me?.data?.unit?.unitConfig?.allow_change_schedule_duration
              }
              label="Duração consulta (minutos)"
            />
          </div>
        </div>

        <div className="row">
          <SelectHolder />

          {process.env.client === "sancla" && <SelectPatient />}
        </div>

        {createSchedulingArgs?.type === "reschedule" && (
          <SelectRescheduleReason />
        )}

        <h3>Data e horário</h3>

        <div className="row">
          <Input
            type="date"
            name="date"
            readOnly={createSchedulingArgs?.type === "edit"}
          />

          <Input
            type="time"
            name="time"
            readOnly={createSchedulingArgs?.type === "edit"}
          />
        </div>

        <Textarea name="majorComplaint" label="Principal queixa" />
      </FormHandler>
    </S.FormCreateScheduling>
  );
}
