import {
  Input,
  Select,
  FormHandler,
  TextEditor,
  InputDatePicker,
} from "infinity-forge";

import { useScheduling, useConfigurationsSystem, useSystem } from "@/presentation";

import {
  SelectServices,
  SelectReturnable,
  SelectRescheduleReason,
} from "./components";
import { useSubmitSchedule } from "./handleSubmit";

import * as S from "./styles";

export function FormCreateScheduling() {
  const {unit} = useSystem()
  const {type} = useConfigurationsSystem();

  const { submit, scheduleUsers } = useSubmitSchedule();
  const createSchedulingArgs = useScheduling(
    (state) => state.createSchedulingArgs
  );

  const initialData = {
    userId: createSchedulingArgs?.scheduleUser?.id
      ? [createSchedulingArgs.scheduleUser.id]
      : [],
    majorComplaint: createSchedulingArgs?.event?.event?.major_complaint || "",
    scheduleServiceTypeId: createSchedulingArgs?.event?.event?.serviceType
      ? [createSchedulingArgs.event.event.serviceType.id]
      : [],
    holderId:
      type === "Vet"
        ? createSchedulingArgs?.event?.event?.holder?.id
          ? [createSchedulingArgs.event.event.holder.id]
          : createSchedulingArgs?.tutors?.find((tutor) => tutor.isMain)?.id
          ? [createSchedulingArgs?.tutors?.find((tutor) => tutor?.isMain)?.id]
          : []
        : undefined,
    holderName:
      type === "Vet"
        ? createSchedulingArgs?.event?.event?.holder?.name
          ? [createSchedulingArgs.event.event.holder.name]
          : createSchedulingArgs?.tutors?.find((tutor) => tutor.isMain)?.name
          ? [createSchedulingArgs?.tutors?.find((tutor) => tutor?.isMain)?.name]
          : []
        : undefined,
    time: createSchedulingArgs?.date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    date: createSchedulingArgs?.date,
    patientId:
      type !== "Vet"
        ? [
            createSchedulingArgs?.event?.event?.patient?.id ||
              createSchedulingArgs?.id,
          ]
        : type === "Vet"
        ? createSchedulingArgs?.id
          ? [createSchedulingArgs?.id]
          : []
        : createSchedulingArgs?.tutors?.find((tutor) => tutor.isMain)?.id
        ? [createSchedulingArgs.tutors.find((tutor) => tutor.isMain)?.id]
        : [],
    patientName:
      type !== "Vet"
        ? [
            createSchedulingArgs?.event?.event?.patient?.name ||
              createSchedulingArgs?.name,
          ]
        : type === "Vet"
        ? createSchedulingArgs?.event?.event?.patient?.name
          ? [createSchedulingArgs.event.event.patient.name]
          : createSchedulingArgs?.name
          ? [createSchedulingArgs?.name]
          : []
        : createSchedulingArgs?.tutors?.find((tutor) => tutor.isMain)?.name
        ? [createSchedulingArgs.tutors.find((tutor) => tutor.isMain)?.name]
        : [],
    executions: [],
  };

  const users = scheduleUsers?.map((user) => ({
    label: user.name,
    value: user.id,
  }));

  return (
    <S.FormCreateScheduling>
      <FormHandler
        isStickyButtons
        button={{ text: "Agendar" }}
        onSucess={submit}
        initialData={initialData}
        cleanFieldsOnSubmit={false}
        disableEnterKeySubmitForm
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
              readOnly={!unit?.configs?.schedules?.allow_change_schedule_duration}
              label="Duração consulta (minutos)"
            />
          </div>
        </div>

        <div className="row">
          <Input
            name={type === "Vet" ? "holderName" : "patientName"}
            disabled
            label={type === "Vet" ? "Tutor" : "Cliente"}
          />

          {type === "Vet" && (
            <Input name="patientName" disabled label="Paciente" />
          )}
        </div>

        {createSchedulingArgs?.type === "reschedule" && (
          <SelectRescheduleReason />
        )}

        <h3>Data e horário</h3>

        <div className="row">
          <InputDatePicker
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

        <TextEditor name="majorComplaint" label="Principal queixa" />
      </FormHandler>
    </S.FormCreateScheduling>
  );
}
