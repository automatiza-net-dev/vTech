import {
  Input,
  Select,
  FormHandler,
  TextEditor,
  InputDatePicker,
} from "infinity-forge";

import {
  useScheduling,
  useConfigurationsSystem,
  useSystem,
} from "@/presentation";
import {
  SelectServices,
  SelectReturnable,
  SelectRescheduleReason,
} from "./components";
import { useSubmitSchedule } from "./handleSubmit";
import * as S from "./styles";
import { ScheduleAuthorization } from "./components/schedule-authorization";
import { useScheduleAuthorization } from "./components/schedule-authorization/hook";
import * as yup from "yup";
import { useVerifyFinanceSchedule } from "../../../../utils/use-verify-finance-schedule";

export function FormCreateScheduling() {
  const { unit } = useSystem();
  const { type } = useConfigurationsSystem();

  const { submit, scheduleUsers } = useSubmitSchedule();
  const createSchedulingArgs = useScheduling(
    (state) => state.createSchedulingArgs,
  );

  const patientId =
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
          : [];

  const holderId =
    type === "Vet"
      ? createSchedulingArgs?.event?.event?.holder?.id
        ? [createSchedulingArgs.event.event.holder.id]
        : createSchedulingArgs?.tutors?.find((tutor) => tutor.isMain)?.id
          ? [createSchedulingArgs?.tutors?.find((tutor) => tutor?.isMain)?.id]
          : []
      : undefined;

  const initialData = {
    userId: createSchedulingArgs?.scheduleUser?.id
      ? [createSchedulingArgs.scheduleUser.id]
      : [],
    majorComplaint: createSchedulingArgs?.event?.event?.major_complaint || "",
    scheduleServiceTypeId: createSchedulingArgs?.event?.event?.serviceType
      ? [createSchedulingArgs.event.event.serviceType.id]
      : [],
    holderId,
    holderName:
      type === "Vet"
        ? createSchedulingArgs?.event?.event?.holder?.name
          ? [createSchedulingArgs.event.event.holder.name]
          : createSchedulingArgs?.tutors?.find((tutor) => tutor.isMain)?.name
            ? [
                createSchedulingArgs?.tutors?.find((tutor) => tutor?.isMain)
                  ?.name,
              ]
            : []
        : undefined,
    time: createSchedulingArgs?.date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    date: createSchedulingArgs?.date,
    patientId,
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

  const { configsHasBlockFinancePending } = useVerifyFinanceSchedule({});
  const { data, temFinancasEmAberto } = useScheduleAuthorization({
    patientId:
      createSchedulingArgs?.type !== "create"
        ? ""
        : type === "Vet"
          ? holderId
          : patientId,
  });

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
        schema={
          configsHasBlockFinancePending
            ? {
                userEmail: yup.string().required("Campo requerido"),
                userPwd: yup.string().required("Campo requerido"),
              }
            : {}
        }
        customAction={
          configsHasBlockFinancePending || temFinancasEmAberto
            ? {
                Component: () => (
                  <ScheduleAuthorization
                    blocking={configsHasBlockFinancePending as boolean}
                    value={data?.["Valores em Atraso"] || 0}
                  />
                ),
              }
            : undefined
        }
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
                !unit?.configs?.schedules?.allow_change_schedule_duration
              }
              label="Duração consulta (minutos)"
            />
          </div>
        </div>

        <div className="row">
          <Input
            name={type === "Vet" ? "holderName" : "patientName"}
            disabled
            label={type === "Vet" ? "Responsável" : "Cliente"}
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
