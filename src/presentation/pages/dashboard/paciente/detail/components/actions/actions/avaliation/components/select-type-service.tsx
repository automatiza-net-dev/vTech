import { useEffect, Dispatch, SetStateAction } from "react";

import { Select, useAuthAdmin } from "infinity-forge";

import {
  useLoadPatient,
  useLoadAllScheduleServicesGroups,
  useSystem,
  useConfigurationsSystem,
} from "@/presentation";
import { RemoteSystem } from "@/data";
import { TypesAutomatiza, container } from "@/container";
import { useFormikContext } from "formik";

export function SelectTypeService({
  initialService,
  setBody,
}: {
  initialService?: string;
  setBody?: Dispatch<SetStateAction<string>>;
}) {
  const { values, setFieldValue } = useFormikContext<any>();
  const scheduleServiceId = values?.["scheduleServiceId"]?.[0];

  const patient = useLoadPatient();

  const { unit, user } = useSystem()
  const {type} = useConfigurationsSystem()

  const { data, isFetching } = useLoadAllScheduleServicesGroups({});

  async function AddInitialValueInResumeInput(value: string) {
    const optionSelected = data?.find((option) =>
      option.types.find((type) => type.id === value)
    );

    const resume = optionSelected?.types.find(
      (type) => type.id === value
    )?.resume;

    const response = await container
      .get<RemoteSystem>(TypesAutomatiza.RemoteSystem)
      .replace({
        businessUnitId: unit?.id,
        dependentId: type === "Vet" ?  patient?.data?.id : undefined,
        tutorId: type === "Vet" ? patient?.data?.tutor?.id : patient?.data?.id,
        userId: user?.id,
        base: resume,
      });

    setFieldValue("protocol", response.result);
    setBody && setBody(response.result);
  }

  useEffect(() => {
    if (scheduleServiceId && !initialService) {
      AddInitialValueInResumeInput(scheduleServiceId);
    }
  }, [data, scheduleServiceId]);

  if (!data || isFetching) {
    return <></>;
  }

  return (
    <Select
      label="Tipo atendimento"
      menuPlacement={"bottom"}
      isGroup
      onChangeInput={(ev) => {
        const value = (ev as string[])[0];

        AddInitialValueInResumeInput(value);
      }}
      disabled={!!initialService}
      name="scheduleServiceId"
      loading={isFetching}
      placeholder="Selecione o tipo de atendimento"
      options={
        data?.reduce((reducer: any, result: any) => {
          return [
            ...reducer,
            {
              label: result?.description,
              options:
                result?.types?.map((type) => ({
                  value: type?.id,
                  label: type?.description,
                })) || [],
            },
          ];
        }, []) || []
      }
    />
  );
}
