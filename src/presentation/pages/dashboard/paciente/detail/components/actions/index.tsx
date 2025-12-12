import { useRouter } from "next/router";

import { Error, Button, useToast } from "infinity-forge";

import { useLoadSchedule } from "@/presentation/hooks";

import { Actions } from "./actions";
import { FinishService } from "./finish-service";
import { Hospitalization } from "./hospitalization";
import { StartService } from "@/presentation/components/schedule/actions";

import * as S from "./styles";

export function ActionsPatient() {
  const router = useRouter();
  const schedule = useLoadSchedule(router?.query?.scheduleId as string);
  const { createToast } = useToast();

  return (
    <Error name="Actions">
      <S.Actions>
        <div className="box">
          <Hospitalization />

          <Button svg="IconCalendar" href="/dashboard/agenda" text="AGENDA" />

          <Actions
            reloadSchedule={() => {
              schedule.mutate();
              return createToast({
                message: "Atendimento iniciado com sucesso!",
                status: "success",
              });
            }}
          />

          {schedule?.data &&
            schedule?.data?.serviceStatus?.description === "Na recepção" && (
              <StartService
                buttonTitle="INICIAR ATENDIMENTO"
                onSuccess={() => {
                  schedule.mutate();
                  return createToast({
                    message: "Atendimento iniciado com sucesso!",
                    status: "success",
                  });
                }}
                event={schedule?.data}
                patientId={schedule?.data?.patient?.id}
                showNativeForm={false}
              />
            )}
        </div>

        <FinishService />
      </S.Actions>
    </Error>
  );
}
